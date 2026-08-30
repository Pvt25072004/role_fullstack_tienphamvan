function generateUUID() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const sessionId = generateUUID();
let currentState = "ACTIVE";
let idleTimer = null;
const IDLE_TIMEOUT = 30000;

function getDomain() {
  return window.location.hostname;
}

function extractContent() {
  const article =
    document.querySelector("article") ||
    document.querySelector(".fck_detail") ||
    document.querySelector(".singular-content") ||
    document.querySelector(".detail-content");
  if (article) {
    return article.innerText.substring(0, 5000); // Limit length
  }
  return document.body.innerText.substring(0, 2000);
}

function sendEvent(eventType) {
  const event = {
    event_id: generateUUID(),
    session_id: sessionId,
    event_type: eventType,
    url: window.location.href,
    title: document.title,
    domain: getDomain(),
    timestamp: Date.now(),
  };

  if (eventType === "PAGE_ENTER") {
    event.content = extractContent();
  }

  chrome.runtime.sendMessage({ type: "NEW_EVENT", payload: event });
}

function resetIdleTimer() {
  if (currentState === "INACTIVE" && document.visibilityState === "visible") {
    currentState = "ACTIVE";
    sendEvent("PAGE_ACTIVE");
  }

  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (currentState === "ACTIVE") {
      currentState = "INACTIVE";
      sendEvent("PAGE_INACTIVE");
    }
  }, IDLE_TIMEOUT);
}

// Initial event
sendEvent("PAGE_ENTER");
resetIdleTimer();

// Visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    if (currentState === "INACTIVE") {
      currentState = "ACTIVE";
      sendEvent("PAGE_ACTIVE");
    }
    resetIdleTimer();
  } else {
    if (currentState === "ACTIVE") {
      currentState = "INACTIVE";
      sendEvent("PAGE_INACTIVE");
    }
    clearTimeout(idleTimer);
  }
});

// User interactions
["scroll", "mousemove", "keydown", "click"].forEach((evt) => {
  window.addEventListener(
    evt,
    () => {
      if (document.visibilityState === "visible") {
        resetIdleTimer();
      }
    },
    { passive: true },
  );
});

window.addEventListener("beforeunload", () => {
  sendEvent("PAGE_LEAVE");
});
