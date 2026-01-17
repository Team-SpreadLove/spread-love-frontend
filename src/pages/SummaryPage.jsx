import LoadingSpinner from "../components/LoadingSpinner";
import { SUMMARY_STATUS } from "../constants/index";
import useResultStore from "../stores/useResultStore";

const SummaryPage = () => {
  const { summaryStatus, summaryData, setSummaryLoading, setSummaryResult, resetSummary } =
    useResultStore();

  const handleSummaryClick = async () => {
    setSummaryLoading();

    chrome.runtime.sendMessage({ type: "SUMMARIZE" }, (response) => {
      if (response?.success) {
        setSummaryResult(response.data);
      } else {
        console.error("요약 실패:", response?.error);
        resetSummary();
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {summaryStatus === SUMMARY_STATUS.DEFAULT && (
        <button
          type="button"
          onClick={handleSummaryClick}
          className="flex items-center justify-center gap-2 w-full h-[30px] bg-sl-blue border rounded-2xl font-medium text-white cursor-pointer"
        >
          <img src="/images/icons/spreadlove-summary-16.svg" alt="요약 아이콘" aria-hidden="true" />
          <span>이 페이지 요약하기</span>
        </button>
      )}
      {summaryStatus === SUMMARY_STATUS.LOADING && (
        <LoadingSpinner message={"페이지를 요약중입니다..."} />
      )}
      {summaryStatus === SUMMARY_STATUS.RESULT && summaryData && (
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px]">{summaryData.title}</h1>
          <p className="text-2xl">{summaryData.summary}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
