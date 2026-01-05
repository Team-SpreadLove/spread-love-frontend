import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col h-screen gap-5 p-5">
      <Header />
      <main className="flex flex-col items-center justify-center gap-2 w-full h-full p-3 border border-sl-blue rounded-xl">
        <button className="flex items-center justify-center gap-2 w-full h-[30px] bg-sl-blue border rounded-2xl font-medium text-white">
          <img src="/images/icons/spreadlove-summary-16.svg" alt="요약 아이콘" aria-hidden="true" />
          <span>이 페이지 요약하기</span>
        </button>
        <LoadingSpinner message={"페이지를 요약중입니다..."} />
        <div className="flex flex-col gap-4">
          <p className="text-[32px]">네이버</p>
          <p className="text-[24px]">
            이 페이지는 검색을 중심으로 뉴스, 쇼핑, 콘텐츠로 빠르게 이동하게 해주는 국내 대표 포털의
            시작 화면이다. 검색창을 통해 원하는 상품을 한번에 찾을 수 있다. 뉴스, 스포츠, 연예, 날씨
            정보가 실시간으로 제공된다.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
