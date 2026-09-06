# LookUp Bot

Select text on any webpage, right-click, and get an AI-powered explanation —
grounded in a real web search, not just the model's memory.

Built deliberately as a **single-purpose lookup tool, not a chatbot**: no
conversation history, no free-form prompt field, hard input length caps.
This keeps it fast, cheap, and hard to abuse.

##How to setup on chrome
1. Go to chrome://extensions
2. Turn on Developer mode (top right)
3. Click Load unpacked
4. Select this extension folder
5. Go to any webpage, select some text, right-click, click "Look up ..."

## How it works
1.If you change you you to antropic or any different change
   MODEL = "gemini-3.6-flash" to you model and
   genai.configure(api_key=os.environ["GEMINI_API_KEY"])
2. A Chrome extension (`extension/`) adds a right-click menu item that
   appears when you select text.
3. Clicking it sends the selection to a small local backend (`backend/`).
4. The backend searches the web (DuckDuckGo, API key needed) and asks
   an LLM (Google Gemini, free tier) to explain the result in a few sentences.
5. The answer — with source links — appears in a small overlay right on
   the page.
6. Use a google studio aistudio.google.com for an free api key or any API_KEY
   like antropic or anything but my recommend is aistudio.google free API_KEY
## Setup

See `backend/README.md` and `extension/README.md` for step-by-step setup.
Short version:

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\Activate.ps1
pip install -r requirements.txt
export GEMINI_API_KEY=your-key-here   # Windows: $env:GEMINI_API_KEY="..."
uvicorn app:app --reload --port 8787
```

Then load `extension/` as an unpacked extension in `chrome://extensions`
(enable Developer mode → Load unpacked).

## Status / Roadmap

- [x] Right-click menu + overlay
- [x] Backend: web search + LLM summary
- [x] Wired end-to-end
- [ ] Rate limiting
- [ ] Nicer overlay styling
- [ ] Easier install (no manual Python server)
- [ ] OS-wide version (works in any app, not just the browser)

## License

MIT — see `LICENSE`.
