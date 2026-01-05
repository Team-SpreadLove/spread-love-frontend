import Logo from "./components/Logo";

const App = () => {
  return (
    <div className="p-5">
      <header>
        <div className="flex justify-between">
          <Logo iconSize={32} textSize="16px" spacing="mt-0.5 ml-1" />
          <div className="flex gap-x-2">
            <button className="bg-sl-white border border-sl-blue w-[65px] h-[30px] rounded-2xl font-medium">
              기록
            </button>
            <button className="bg-sl-white border border-sl-blue w-[65px] h-[30px] rounded-2xl font-medium">
              로그인
            </button>
            <button className="bg-sl-white border border-sl-blue w-[65px] h-[30px] rounded-2xl font-medium">
              설정
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
