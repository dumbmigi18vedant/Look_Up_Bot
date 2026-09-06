# LookUp Bot

Select text on any webpage, right-click, and get an AI-powered explanation —
grounded in a real web search, not just the model's memory.

Built deliberately as a **single-purpose lookup tool, not a chatbot**: no
conversation history, no free-form prompt field, hard input length caps.
This keeps it fast, cheap, and hard to abuse.

## How it works

1. A Chrome extension (`extension/`) adds a right-click menu item that
   appears when you select text.
2. Clicking it sends the selection to a small local backend (`backend/`).
3. The backend searches the web (DuckDuckGo, no API key needed) and asks
   an LLM (Google Gemini, free tier) to explain the result in a few sentences.
4. The answer — with source links — appears in a small overlay right on
   the page.

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
