# LookUp Bot — Backend (Step 2)

A single-endpoint server: give it selected text, it searches the web and returns
a short AI explanation. No chat, no memory, no way to smuggle in arbitrary prompts.

## Run it locally

```bash
cd backend
pip install -r requirements.txt

export ANTHROPIC_API_KEY=your-key-here   # or copy .env.example to .env and load it

uvicorn app:app --reload --port 8787
```

## Test it

```bash
curl -X POST http://localhost:8787/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "Linux environments"}'
```

You should get back JSON like:

```json
{
  "query": "Linux environments",
  "answer": "...",
  "sources": ["https://...", "https://..."]
}
```

## Guardrails baked in
- `MAX_INPUT_CHARS` (300) — rejects anything longer, so nobody pastes in a whole article.
- One fixed prompt template — the client can never override system behavior or start a multi-turn chat.
- Every user runs this with their own API key, so cost is on them, not you.

## What's next
1. ✅ Extension skeleton
2. ✅ Backend service (this step)
3. Wire `content.js` to call `http://localhost:8787/lookup` instead of showing the stub text
4. Add rate limiting (e.g. max N lookups/minute) so even a misbehaving script can't hammer the local server
5. Package/distribute
