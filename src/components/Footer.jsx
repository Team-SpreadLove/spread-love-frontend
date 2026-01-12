import Button from "./Button";
import { SUMMARY_STATUS } from "../constants/index.js";

const Footer = ({ isLoggedIn, currentPath, summaryStatus, onDeleteClick }) => {
  const isLoading = summaryStatus === SUMMARY_STATUS.LOADING;
  const isResult = summaryStatus === SUMMARY_STATUS.RESULT;

  const isSummaryPage = currentPath === "/";
  const isHistoryDetailPage = currentPath.startsWith("/history/");

  const isSaveButtonVisible = !isLoading && ((isSummaryPage && isResult) || isHistoryDetailPage);
  const isDeleteButtonVisible =
    !isLoading && isLoggedIn && ((isSummaryPage && isResult) || isHistoryDetailPage);

  return (
    <footer className="flex justify-end gap-x-2">
      {isSaveButtonVisible && (
        <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
          저장
        </Button>
      )}
      {isDeleteButtonVisible && (
        <Button bgColor="bg-sl-white" borderColor="border-sl-blue" onClick={onDeleteClick}>
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
