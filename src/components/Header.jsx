import { useNavigate } from "react-router";
import Logo from "./Logo";
import Button from "./Button";
import { SUMMARY_STATUS } from "../constants/index.js";
import useAuthStore from "../stores/useAuthStore";
import useResultStore from "../stores/useResultStore";

const Header = ({ currentPath }) => {
  const { isLoggedIn } = useAuthStore();
  const { summaryStatus, resetSummary, resetAnalysis } = useResultStore();
  const navigate = useNavigate();

  const isLoading = summaryStatus === SUMMARY_STATUS.LOADING;
  const isHistoryPage = currentPath.startsWith("/history");
  const isHistoryButtonVisible = !isLoading && isLoggedIn && !isHistoryPage;

  const handleLogoClick = () => {
    resetSummary();
    resetAnalysis();
  };

  const handleLoginClick = () => {
    const loginUrl = chrome.runtime.getURL("src/tabs/login.html");

    chrome.tabs.query({ url: loginUrl }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true });
      } else {
        chrome.tabs.create({ url: loginUrl });
      }
    });
  };

  const handleLogoutClick = () => {
    chrome.storage.local.remove("userToken");
    navigate("/");
  };

  const handleSettingsClick = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <header>
      <div className="flex justify-between">
        <Logo iconSize={32} textSize={16} spacing="mt-0.5 ml-1" onClick={handleLogoClick} />
        <div className="flex gap-x-2">
          {isHistoryButtonVisible && (
            <Button to="/history" bgColor="bg-sl-white" borderColor="border-sl-blue">
              기록
            </Button>
          )}
          {!isLoading && (
            <Button
              bgColor="bg-sl-white"
              borderColor="border-sl-blue"
              onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
            >
              {isLoggedIn ? "로그아웃" : "로그인"}
            </Button>
          )}
          <Button bgColor="bg-sl-white" borderColor="border-sl-blue" onClick={handleSettingsClick}>
            설정
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
