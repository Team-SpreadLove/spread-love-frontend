import { api, fetchGuestToken, fetchRateLimit } from "../shared/api/client.js";
import { ERROR_MESSAGE, DEFAULT_SETTINGS } from "../shared/constants/index.js";

const getErrorMessage = async (error) => {
  const data = error.response ? await error.response.json().catch(() => null) : null;
  const serverMessage = data?.error?.message;

  if (serverMessage) return serverMessage;

  if (error.message === "Failed to fetch") {
    return ERROR_MESSAGE.NETWORK;
  }

  return error.message || ERROR_MESSAGE.UNKNOWN;
};

const withErrorHandling = (handler) => async (payload, sendResponse) => {
  try {
    const data = await handler(payload);

    sendResponse(data);
  } catch (error) {
    const errorMessage = await getErrorMessage(error);

    sendResponse({ success: false, error: errorMessage });
  }
};

const getUserSettings = async () => {
  const { settings } = await chrome.storage.sync.get("settings");

  return settings || DEFAULT_SETTINGS;
};

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const focusedImages = new Map();
let sidePanelPort = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "sidePanel") return;

  sidePanelPort = port;

  port.onDisconnect.addListener(() => {
    sidePanelPort = null;
  });
});

const handleSummarize = async () => {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const userSettings = await getUserSettings();

  const data = await api
    .post("summaries", {
      json: { url: activeTab.url, settings: userSettings },
    })
    .json();

  await fetchRateLimit();

  return data;
};

const handleFetchHistories = async (payload) => {
  const { page = 1, limit = 11 } = payload || {};

  return api.get(`histories?page=${page}&limit=${limit}`).json();
};

const handleDeleteHistory = async (payload) => {
  return api.delete(`histories/${payload.historyId}`).json();
};

const handleAnalyzeImage = async (payload) => {
  const { imageUrl, pageUrl } = payload;
  const userSettings = await getUserSettings();

  const data = await api
    .post("analyses", {
      json: { imageUrl, pageUrl, settings: userSettings },
    })
    .json();

  await fetchRateLimit();

  return data;
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
    withErrorHandling(handleSummarize)(message.payload, sendResponse);

    return true;
  }

  if (message.type === "FETCH_HISTORIES") {
    withErrorHandling(handleFetchHistories)(message.payload, sendResponse);
    return true;
  }

  if (message.type === "DELETE_HISTORY") {
    withErrorHandling(handleDeleteHistory)(message.payload, sendResponse);
    return true;
  }

  if (message.type === "ANALYZE_IMAGE") {
    withErrorHandling(handleAnalyzeImage)(message.payload, sendResponse);
    return true;
  }
};

const handleAnalyzeImageCommand = async (tab) => {
  const focusedImage = focusedImages.get(tab.id);

  if (!focusedImage) {
    return;
  }

  if (sidePanelPort) {
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
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

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
