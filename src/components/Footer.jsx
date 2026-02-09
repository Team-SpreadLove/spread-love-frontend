import { useState, useEffect } from "react";
import Button from "./Button";
import { SUMMARY_STATUS, IMAGE_ANALYSIS_STATUS } from "../constants/index.js";
import useAuthStore from "../stores/useAuthStore";
import useResultStore from "../stores/useResultStore";
import useModalStore from "../stores/useModalStore";

const Footer = ({ currentPath }) => {
  const { isLoggedIn } = useAuthStore();
  const { summaryStatus, analysisStatus } = useResultStore();
  const { openModal } = useModalStore();
  const [remainingCount, setRemainingCount] = useState(null);

  const handleCloseClick = () => {
    window.close();
  };

  useEffect(() => {
    chrome.storage.local.get("remainingCount", (res) => {
      setRemainingCount(res.remainingCount);
    });

    const handleStorageChange = (changes) => {
      if (changes.remainingCount) {
        setRemainingCount(changes.remainingCount.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const isLoading = summaryStatus === SUMMARY_STATUS.LOADING;
  const isResult = summaryStatus === SUMMARY_STATUS.RESULT;
  const isAnalysisResult = analysisStatus === IMAGE_ANALYSIS_STATUS.RESULT;

  const isSummaryPage = currentPath === "/";
  const isHistoryDetailPage = currentPath.startsWith("/history/");
  const isAnalysisPage = currentPath === "/analysis";

  const hasResult =
    (isSummaryPage && isResult) || isHistoryDetailPage || (isAnalysisPage && isAnalysisResult);

  const isDeleteButtonVisible = !isLoading && isLoggedIn && hasResult;

  return (
    <footer className="relative flex justify-end gap-x-2">
      {remainingCount !== null && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-base text-sl-black ml-1">
          남은 횟수: {remainingCount}
        </div>
      )}
      {isDeleteButtonVisible && (
        <Button bgColor="bg-sl-white" borderColor="border-sl-blue" onClick={openModal}>
          삭제
        </Button>
      )}
      <Button bgColor="bg-sl-white" borderColor="border-sl-blue" onClick={handleCloseClick}>
        닫기
      </Button>
    </footer>
  );
};

export default Footer;
