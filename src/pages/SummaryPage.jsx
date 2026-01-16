import { useOutletContext } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { SUMMARY_STATUS } from "../constants/index";

const SummaryPage = () => {
  const { summaryStatus, setSummaryStatus, summaryData, setSummaryData } = useOutletContext();

  const handleSummaryClick = async () => {
    setSummaryStatus(SUMMARY_STATUS.LOADING);

    chrome.runtime.sendMessage({ type: "SUMMARIZE" }, (response) => {
      if (response?.success) {
        setSummaryData(response.data);

        setSummaryStatus((currentStatus) => {
          if (currentStatus !== SUMMARY_STATUS.LOADING) {
            return currentStatus;
          }

          return SUMMARY_STATUS.RESULT;
        });
      } else {
        console.error("요약 실패:", response?.error);

        setSummaryStatus(SUMMARY_STATUS.DEFAULT);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {summaryStatus === SUMMARY_STATUS.DEFAULT && (
        <button
          type="button"
          onClick={handleSummaryClick}
          className="flex items-center justify-center gap-2 w-full h-[30px] bg-sl-blue border rounded-2xl font-medium text-white"
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
