import { api } from "../api/client.js";

const sidePanelConfig = { openPanelOnActionClick: true };
const focusedImages = new Map();

const handleSummarizeMessage = async (payload, sendResponse) => {
  const { url, imageBase64 } = payload;
  const response = await fetch(imageBase64);
  const imageBlob = await response.blob();

  const formData = new FormData();
  formData.append("url", url);
  formData.append("image", imageBlob, "screenshot.png");

  try {
    const data = await api.post("summaries", { body: formData }).json();

    sendResponse(data);
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
};

const handleFetchHistories = async (sendResponse) => {
  try {
    const data = await api.get("histories").json();

    sendResponse(data);
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
};

const handleFetchHistoryDetail = async (payload, sendResponse) => {
  try {
    const data = await api.get(`histories/${payload.historyId}`).json();

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
    const data = await api
      .post("analyses", {
        json: { imageUrl, pageUrl },
      })
      .json();

    sendResponse({ success: true, data });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
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
    handleSummarizeMessage(message.payload, sendResponse);

    return true;
  }

  if (message.type === "DELETE_HISTORY") {
    handleDeleteHistory(message.payload, sendResponse);

    return true;
  }

  if (message.type === "FETCH_HISTORIES") {
    handleFetchHistories(sendResponse);

    return true;
  }

  if (message.type === "FETCH_HISTORY_DETAIL") {
    handleFetchHistoryDetail(message.payload, sendResponse);

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

const init = () => {
  chrome.sidePanel.setPanelBehavior(sidePanelConfig).catch((error) => console.error(error));
  chrome.runtime.onMessage.addListener(handleMessage);

  chrome.commands.onCommand.addListener((command, tab) => {
    if (command === "analyze-image") {
      handleAnalyzeImageCommand(tab);
    }
  });
};

init();
