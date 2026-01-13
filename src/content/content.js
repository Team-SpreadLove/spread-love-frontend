const handleGetFocusedImage = (message, sender, sendResponse) => {
  if (message.type !== "GET_FOCUSED_IMAGE") {
    return;
  }

  const focusedElement = document.activeElement;
  const isImage = focusedElement && focusedElement.tagName === "IMG";
  const hasAlt = focusedElement && focusedElement.alt && focusedElement.alt.trim();

  if (!isImage || hasAlt) {
    sendResponse({ hasImage: false });

    return;
  }

  sendResponse({
    hasImage: true,
    imageUrl: focusedElement.currentSrc || focusedElement.src,
    pageUrl: window.location.href,
  });
};
chrome.runtime.onMessage.addListener(handleGetFocusedImage);
