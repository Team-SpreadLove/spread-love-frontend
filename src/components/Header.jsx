import Logo from "./Logo";
import Button from "./Button";
import { SUMMARY_STATUS } from "../constants/index.js";

const Header = ({ isLoggedIn, summaryStatus }) => {
  const isLoading = summaryStatus === SUMMARY_STATUS.LOADING;

  return (
    <header>
      <div className="flex justify-between">
        <Logo iconSize={32} textSize={16} spacing="mt-0.5 ml-1" />
        <div className="flex gap-x-2">
          {!isLoading && isLoggedIn && (
            <Button to="/history" bgColor="bg-sl-white" borderColor="border-sl-blue">
              기록
            </Button>
          )}
          {!isLoading && !isLoggedIn && (
            <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
              로그인
            </Button>
          )}
          {!isLoading && isLoggedIn && (
            <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
              로그아웃
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
