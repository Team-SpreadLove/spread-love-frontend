export const requestCapturePermission = async () => {
  const origins = ["<all_urls>"];
  const hasPermission = await chrome.permissions.contains({ origins });

  if (hasPermission) return true;

  return await chrome.permissions.request({ origins });
};
