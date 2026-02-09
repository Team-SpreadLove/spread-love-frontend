import { api, fetchGuestToken, fetchRateLimit } from "../api/client.js";

const sidePanelConfig = { openPanelOnActionClick: true };
const focusedImages = new Map();

const isTokenExpired = (token) => {
  try {
    let jwtToken = token;
    if (token.startsWith("guest_")) {
      jwtToken = token.slice(6);
    }
    const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const handleSummarizeMessage = async (sendResponse) => {
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = activeTab.url;

    const { settings } = await chrome.storage.sync.get("settings");
    const userSettings = settings || { length: "medium", persona: "default" };

    const data = await api
      .post("summaries", {
        json: { url, settings: userSettings },
      })
      .json();

    await fetchRateLimit();
    sendResponse(data);
  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      const data = await error.response.json().catch(() => null);
      if (data && data.error) {
        errorMessage = data.error;
      }
    }
    sendResponse({ success: false, error: errorMessage });
  }
};

const handleFetchHistories = async (payload, sendResponse) => {
  try {
    const { page = 1, limit = 12 } = payload || {};
    const data = await api.get(`histories?page=${page}&limit=${limit}`).json();

    sendResponse(data);
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
};

const handleDeleteHistory = async (payload, sendResponse) => {
  try {
    const data = await api.delete(`histories/${payload.historyId}`).json();

    sendResponse(data);
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
};

const handleAnalyzeImage = async (payload, sendResponse) => {
  const { imageUrl, pageUrl } = payload;

  try {
    const { settings } = await chrome.storage.sync.get("settings");
    const userSettings = settings || { length: "medium", persona: "default" };

    const data = await api
      .post("analyses", {
        json: { imageUrl, pageUrl, settings: userSettings },
      })
      .json();

    await fetchRateLimit();
    sendResponse({ success: true, data });
  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      const data = await error.response.json().catch(() => null);
      if (data && data.error) {
        errorMessage = data.error;
      }
    }
    sendResponse({ success: false, error: errorMessage });
  }
};

const handleMessage = (message, sender, sendResponse) => {
  if (message.type === "IMAGE_FOCUSED") {
    focusedImages.set(sender.tab.id, {
      imageUrl: message.imageUrl,
      pageUrl: message.pageUrl,
    });

    return true;
  }

  if (message.type === "IMAGE_UNFOCUSED") {
    focusedImages.delete(sender.tab.id);

    return true;
  }

  if (message.type === "SUMMARIZE") {
    handleSummarizeMessage(sendResponse);

    return true;
  }

  if (message.type === "DELETE_HISTORY") {
    handleDeleteHistory(message.payload, sendResponse);

    return true;
  }

  if (message.type === "FETCH_HISTORIES") {
    handleFetchHistories(message.payload, sendResponse);

    return true;
  }

  if (message.type === "ANALYZE_IMAGE") {
    handleAnalyzeImage(message.payload, sendResponse);

    return true;
  }
};

const handleAnalyzeImageCommand = async (tab) => {
  const focusedImage = focusedImages.get(tab.id);

  if (!focusedImage) {
    return;
  }

  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (error) {
    console.error("[Spread Love] Side Panel 열기 실패:", error);
    return;
  }

  await chrome.storage.local.remove("pendingImageAnalysis");
  await chrome.storage.local.set({ pendingImageAnalysis: focusedImage });
};

const init = async () => {
  chrome.sidePanel.setPanelBehavior(sidePanelConfig).catch((error) => console.error(error));
  chrome.runtime.onMessage.addListener(handleMessage);

  chrome.commands.onCommand.addListener((command, tab) => {
    if (command === "analyze-image") {
      handleAnalyzeImageCommand(tab);
    }
  });

  const { guestToken } = await chrome.storage.local.get("guestToken");
  if (!guestToken || isTokenExpired(guestToken)) {
    fetchGuestToken().catch((err) => console.error("초기 게스트 토큰 발급 실패:", err));
  }
};

init();
