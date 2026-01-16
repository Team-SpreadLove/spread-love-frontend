import Button from "./Button";
import { SUMMARY_STATUS, IMAGE_ANALYSIS_STATUS } from "../constants/index.js";
import useAuthStore from "../stores/useAuthStore";
import useResultStore from "../stores/useResultStore";
import useModalStore from "../stores/useModalStore";

const Footer = ({ currentPath }) => {
  const { isLoggedIn } = useAuthStore();
  const { summaryStatus, analysisStatus } = useResultStore();
  const { openModal } = useModalStore();

  const isLoading = summaryStatus === SUMMARY_STATUS.LOADING;
  const isResult = summaryStatus === SUMMARY_STATUS.RESULT;
  const isAnalysisResult = analysisStatus === IMAGE_ANALYSIS_STATUS.RESULT;

  const isSummaryPage = currentPath === "/";
  const isHistoryDetailPage = currentPath.startsWith("/history/");
  const isAnalysisPage = currentPath === "/analysis";

  const hasResult =
    (isSummaryPage && isResult) || isHistoryDetailPage || (isAnalysisPage && isAnalysisResult);

  const isSaveButtonVisible = !isLoading && hasResult;
  const isDeleteButtonVisible = !isLoading && isLoggedIn && hasResult;

  return (
    <footer className="flex justify-end gap-x-2">
      {isSaveButtonVisible && (
        <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
          저장
        </Button>
      )}
      {isDeleteButtonVisible && (
        <Button bgColor="bg-sl-white" borderColor="border-sl-blue" onClick={openModal}>
          삭제
        </Button>
      )}
      <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
        닫기
      </Button>
    </footer>
  );
};

export default Footer;
