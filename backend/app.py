"""
LookUp Bot backend — Step 2

One job only: take a short piece of selected text, search the web for context,
ask an LLM to explain it in a few sentences, and return the answer.

Deliberately NOT a chat API:
- no conversation history
- no free-form "system prompt" the client can control
- hard input length cap
- single fixed prompt template

This is what keeps it "select and search only" instead of turning into a
general-purpose chatbot that could rack up unlimited API cost.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from ddgs import DDGS
import google.generativeai as genai

MAX_INPUT_CHARS = 300          # selected text longer than this is rejected
MAX_SEARCH_RESULTS = 3         # how many web results we feed the model
MODEL = "gemini-3.6-flash"

app = FastAPI(title="LookUp Bot Backend")

# Allow the extension (running from a chrome-extension:// origin) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # fine for a local/self-hosted tool; tighten if you deploy publicly
    allow_methods=["POST"],
    allow_headers=["*"],
)

genai.configure(api_key=os.environ["GEMINI_API_KEY"])  # reads GEMINI_API_KEY from the environment
model = genai.GenerativeModel(MODEL)


class LookupRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_INPUT_CHARS)


class LookupResponse(BaseModel):
    query: str
    answer: str
    sources: list[str]


@app.post("/lookup", response_model=LookupResponse)
def lookup(req: LookupRequest):
    query = req.text.strip()
    if not query:
        raise HTTPException(400, "Empty selection.")

    # 1. Web search for grounding
    try:
        results = list(DDGS().text(query, max_results=MAX_SEARCH_RESULTS))
    except Exception:
        results = []  # fall back to model's own knowledge if search fails

    context_block = "\n\n".join(
        f"[{i+1}] {r.get('title', '')}\n{r.get('body', '')}"
        for i, r in enumerate(results)
    ) or "(no search results found)"

    sources = [r.get("href", "") for r in results if r.get("href")]

    # 2. Ask the model to explain, grounded in the search results, in a few sentences.
    prompt = (
        f'The user selected this text while browsing: "{query}"\n\n'
        f"Here is some web search context:\n{context_block}\n\n"
        "In 2-4 short sentences, explain what this means in plain language. "
        "If it's a term, define it. If it's a claim, briefly say what's known about it. "
        "Do not add unrelated commentary."
    )

    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            max_output_tokens=300,
        )
    )
    answer = response.text

    return LookupResponse(query=query, answer=answer, sources=sources)


@app.get("/health")
def health():
    return {"status": "ok"}