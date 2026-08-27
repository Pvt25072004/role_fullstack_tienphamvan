const SERVER_URL = 'http://localhost:3000/api/events';

let tabSessions = {};

// Sync queued events
async function syncEvents() {
  chrome.storage.local.get(['eventQueue'], async (result) => {
    let queue = result.eventQueue || [];
    if (queue.length === 0) return;
    
    let failed = [];
    for (let event of queue) {
      try {
        const response = await fetch(SERVER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        });
        if (!response.ok) {
          failed.push(event);
        }
      } catch (e) {
        failed.push(event);
      }
    }
    
    chrome.storage.local.set({ eventQueue: failed });
  });
}

// Listen for network becoming online
self.addEventListener('online', syncEvents);

async function handleEvent(event, tabId) {
  if (event.event_type === 'PAGE_ENTER' && tabId) {
    tabSessions[tabId] = event.session_id;
  }
  
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!response.ok) throw new Error('Server error');
  } catch (error) {
    // Queue for later
    chrome.storage.local.get(['eventQueue'], (result) => {
      let queue = result.eventQueue || [];
      queue.push(event);
      chrome.storage.local.set({ eventQueue: queue });
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NEW_EVENT') {
    handleEvent(message.payload, sender.tab ? sender.tab.id : null);
  }
});

// Handle sudden tab close
chrome.tabs.onRemoved.addListener((tabId) => {
  const sessionId = tabSessions[tabId];
  if (sessionId) {
    const leaveEvent = {
      event_id: crypto.randomUUID(),
      session_id: sessionId,
      event_type: 'PAGE_LEAVE',
      timestamp: Date.now()
    };
    handleEvent(leaveEvent, null);
    delete tabSessions[tabId];
  }
});
