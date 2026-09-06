const BACKEND_URL = "http://localhost:8787/lookup";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookup-bot-search",
    title: 'Look up "%s"',
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "lookup-bot-search" || !info.selectionText) return;

  const text = info.selectionText.slice(0, 300); // matches backend's MAX_INPUT_CHARS

  // Tell the content script to show a loading state immediately.
  chrome.tabs.sendMessage(tab.id, { type: "LOOKUP_LOADING", text });

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server returned ${res.status}: ${errText}`);
    }

    const data = await res.json();
    chrome.tabs.sendMessage(tab.id, {
      type: "LOOKUP_RESULT",
      query: data.query,
      answer: data.answer,
      sources: data.sources || []
    });
  } catch (err) {
    chrome.tabs.sendMessage(tab.id, {
      type: "LOOKUP_ERROR",
      text,
      error: "Couldn't reach the LookUp Bot server. Is it running on localhost:8787?"
    });
  }
});
