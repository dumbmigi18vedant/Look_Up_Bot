# LookUp Bot — Browser Extension (Step 1: skeleton)

What this step does:
- Adds a right-click menu item ("Look up '...'") that appears only when you have text selected.
- Clicking it shows a small overlay box near your selection.
- The overlay is currently a **stub** — it doesn't call any AI or search backend yet. That's the next step.

## How to try it (Chrome / Edge / Brave)
1. Go to `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this `extension` folder
5. Go to any webpage, select some text, right-click, click "Look up ..."

## What's next (small portions, one at a time)
1. ✅ Extension skeleton + right-click menu (this step)
2. Backend service: a small server that takes the selected text, does a web search, and asks an LLM to summarize the answer
3. Wire `content.js` to call that backend instead of showing the stub text
4. Add the abuse guardrails you mentioned: cap input length server-side, single-turn only (no conversation memory, no free-form prompt field), rate limiting per user/IP
5. Package for the Chrome Web Store / Firefox Add-ons (or just distribute as a load-unpacked zip for now, since it's open source)
