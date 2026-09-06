// Listens for messages from background.js as the lookup progresses.
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "LOOKUP_LOADING") {
    showOverlay({ query: message.text, loading: true });
  } else if (message.type === "LOOKUP_RESULT") {
    showOverlay({
      query: message.query,
      answer: message.answer,
      sources: message.sources
    });
  } else if (message.type === "LOOKUP_ERROR") {
    showOverlay({ query: message.text, error: message.error });
  }
});

function showOverlay({ query, answer, sources, loading, error }) {
  removeExistingOverlay();

  const host = document.createElement("div");
  host.id = "lookup-bot-overlay-host";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  const selection = window.getSelection();
  const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  const rect = range ? range.getBoundingClientRect() : { top: 100, left: 100, bottom: 120 };

  let bodyHtml;
  if (loading) {
    bodyHtml = `<div class="status">Searching and thinking…</div>`;
  } else if (error) {
    bodyHtml = `<div class="error">${escapeHtml(error)}</div>`;
  } else {
    const sourceLinks = (sources || [])
      .slice(0, 3)
      .map(
        (url, i) =>
          `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">[${i + 1}]</a>`
      )
      .join(" ");
    bodyHtml = `
      <div class="answer">${escapeHtml(answer)}</div>
      ${sourceLinks ? `<div class="sources">Sources: ${sourceLinks}</div>` : ""}
    `;
  }

  shadow.innerHTML = `
    <style>
      .box {
        position: fixed;
        top: ${rect.bottom + window.scrollY + 8}px;
        left: ${rect.left + window.scrollX}px;
        max-width: 340px;
        background: #1e1e1e;
        color: #f0f0f0;
        font-family: system-ui, sans-serif;
        font-size: 14px;
        line-height: 1.45;
        padding: 12px 14px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        z-index: 2147483647;
      }
      .query { font-weight: 600; margin-bottom: 6px; color: #9ecbff; }
      .status { color: #ccc; font-style: italic; }
      .error { color: #ff8a8a; }
      .sources { margin-top: 8px; font-size: 12px; color: #aaa; }
      .sources a { color: #9ecbff; text-decoration: none; margin-right: 4px; }
      .sources a:hover { text-decoration: underline; }
      .close {
        position: absolute; top: 4px; right: 8px;
        cursor: pointer; color: #999; font-size: 12px;
      }
    </style>
    <div class="box">
      <span class="close">✕</span>
      <div class="query">"${escapeHtml((query || "").slice(0, 60))}"</div>
      ${bodyHtml}
    </div>
  `;

  shadow.querySelector(".close").addEventListener("click", removeExistingOverlay);
}

function removeExistingOverlay() {
  const existing = document.getElementById("lookup-bot-overlay-host");
  if (existing) existing.remove();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str || "").replace(/"/g, "&quot;");
}
