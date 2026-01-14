import Logo from "./Logo";
import Button from "./Button";
import { SUMMARY_STATUS } from "../constants/index.js";

const Header = ({
  isLoggedIn,
  summaryStatus,
  currentPath,
  onLogoClick,
  onLoginClick,
  onLogoutClick,
}) => {
  const isLoading = summaryStatus === SUMMARY_STATUS.LOADING;
  const isHistoryPage = currentPath.startsWith("/history");
  const isHistoryButtonVisible = !isLoading && isLoggedIn && !isHistoryPage;

  return (
    <header>
      <div className="flex justify-between">
        <Logo iconSize={32} textSize={16} spacing="mt-0.5 ml-1" onClick={onLogoClick} />
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
              onClick={isLoggedIn ? onLogoutClick : onLoginClick}
            >
              {isLoggedIn ? "로그아웃" : "로그인"}
            </Button>
          )}
          <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
            설정
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
