import Button from "./components/Button";
import Logo from "./components/Logo";

const App = () => {
  return (
    <div className="flex flex-col h-screen gap-5 p-5">
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
      <main className="flex items-center justify-center w-full h-full border border-sl-blue rounded-xl">
        <button className="flex items-center justify-center gap-2 w-full h-[30px] m-3 bg-sl-blue border rounded-2xl font-medium text-white">
          <img src="/images/icons/spreadlove-summary-16.svg" alt="이 페이지 요약하기" />
          <span>이 페이지 요약하기</span>
        </button>
      </main>
    </div>
  );
};

export default App;
