const sidePanelConfig = { openPanelOnActionClick: true };
const init = () => {
  chrome.sidePanel.setPanelBehavior(sidePanelConfig).catch((error) => console.error(error));
};

init();
