import { api } from "../api/client.js";

const sidePanelConfig = { openPanelOnActionClick: true };

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

const messageHandler = (message, sender, sendResponse) => {
  if (message.type === "SUMMARIZE") {
    handleSummarizeMessage(message.payload, sendResponse);

    return true;
  }
};

const init = () => {
  chrome.sidePanel.setPanelBehavior(sidePanelConfig).catch((error) => console.error(error));
  chrome.runtime.onMessage.addListener(messageHandler);
};

init();
