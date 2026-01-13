const handleFocusIn = (event) => {
  const targetElement = event.target;
  const imageElement =
    (targetElement.tagName === "IMG" && targetElement) || targetElement.querySelector("img");

  if (!imageElement) return;

  const hasAlt = imageElement.alt && imageElement.alt.trim();

  if (hasAlt) return;

  chrome.runtime.sendMessage({
    type: "IMAGE_FOCUSED",
    imageUrl: imageElement.currentSrc || imageElement.src,
    pageUrl: window.location.href,
  });
};

const handleFocusOut = () => {
  chrome.runtime.sendMessage({ type: "IMAGE_UNFOCUSED" });
};

const handleGetFocusedImage = (message, sender, sendResponse) => {
  if (message.type !== "GET_FOCUSED_IMAGE") return;

  const focusedElement = document.activeElement;
  const isImage = focusedElement && focusedElement.tagName === "IMG";
  const hasAlt = focusedElement && focusedElement.alt && focusedElement.alt.trim();

  if (!isImage || hasAlt) return sendResponse({ hasImage: false });

  sendResponse({
    hasImage: true,
    imageUrl: focusedElement.currentSrc || focusedElement.src,
    pageUrl: window.location.href,
  });
};

chrome.runtime.onMessage.addListener(handleGetFocusedImage);
document.addEventListener("focusin", handleFocusIn);
document.addEventListener("focusout", handleFocusOut);
