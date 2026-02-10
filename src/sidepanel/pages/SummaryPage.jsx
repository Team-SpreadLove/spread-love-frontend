import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorMessage from "../../shared/components/ErrorMessage";
import { SUMMARY_STATUS } from "../../shared/constants/index";
import useSummaryStore from "../../shared/stores/useSummaryStore";

const SummaryPage = () => {
  const {
    summaryStatus,
    summaryData,
    summaryError,
    setSummaryLoading,
    setSummaryResult,
    setSummaryError,
  } = useSummaryStore();

  const handleSummaryClick = async () => {
    setSummaryLoading();

    chrome.runtime.sendMessage({ type: "SUMMARIZE" }, (response) => {
      if (response?.success) {
        setSummaryResult(response.data);
      } else {
        setSummaryError(response?.error || "페이지 요약에 실패했습니다. 다시 시도해주세요.");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {(summaryStatus === SUMMARY_STATUS.DEFAULT || summaryStatus === SUMMARY_STATUS.ERROR) && (
        <>
          <button
            type="button"
            onClick={handleSummaryClick}
            className="flex items-center justify-center gap-2 w-full h-[30px] bg-sl-blue border rounded-2xl font-medium text-white cursor-pointer"
          >
            <img
              src="/images/icons/spreadlove-summary-16.svg"
              alt="요약 아이콘"
              aria-hidden="true"
            />
            <span>이 페이지 요약하기</span>
          </button>
          {summaryStatus === SUMMARY_STATUS.ERROR && (
            <ErrorMessage message={summaryError} className="mt-4" />
          )}
        </>
      )}
      {summaryStatus === SUMMARY_STATUS.LOADING && (
        <LoadingSpinner message={"페이지를 요약중입니다..."} />
      )}
      {summaryStatus === SUMMARY_STATUS.RESULT && summaryData && (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl">{summaryData.title}</h1>
          <p className="text-2xl">{summaryData.summary}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
