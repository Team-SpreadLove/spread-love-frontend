import Logo from "./Logo";
import Button from "./Button";

const Header = () => {
  return (
    <header>
      <div className="flex justify-between">
        <Logo iconSize={32} textSize="16px" spacing="mt-0.5 ml-1" />
        <div className="flex gap-x-2">
          <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
            기록
          </Button>
          <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
            로그인
          </Button>
          <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
            설정
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
