import { useLocation, useNavigate, matchPath } from "react-router";
import Button from "./Button";
import useModalStore from "../stores/useModalStore";
import useSummaryStore from "../stores/useSummaryStore";
import useAnalysisStore from "../stores/useAnalysisStore";

const DeleteModal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isModalOpen, closeModal } = useModalStore();
  const { summaryData, resetSummary } = useSummaryStore();
  const { analysisData, resetAnalysis } = useAnalysisStore();

  if (!isModalOpen) return null;

  const getHistoryId = () => {
    if (location.pathname === "/") {
      return summaryData?.historyId;
    }

    if (location.pathname.startsWith("/history/")) {
      const match = matchPath("/history/:id", location.pathname);
      return match.params.id;
    }

    if (location.pathname === "/analysis") {
      return analysisData?.data?.historyId;
    }

    return null;
  };

  const handleDelete = () => {
    const historyId = getHistoryId();

    chrome.runtime.sendMessage(
      {
        type: "DELETE_HISTORY",
        payload: { historyId },
      },
      (response) => {
        if (!response.success) return;

        closeModal();

        if (location.pathname === "/") {
          resetSummary();
        }

        if (location.pathname.startsWith("/history/")) {
          navigate("/history");
        }

        if (location.pathname === "/analysis") {
          resetAnalysis();
          navigate("/");
        }
      },
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center">
      <div className="absolute inset-0 bg-sl-black/85"></div>
      <div className="relative w-full m-3 p-6 bg-sl-white border-3 border-sl-blue rounded-2xl shadow-2xl">
        <h2 className="mb-2 text-xl font-bold text-sl-black">기록 삭제</h2>
        <p className="mb-6 text-base font-semibold text-sl-black">
          이 채팅을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
        </p>
        <div className="flex justify-end gap-3">
          <Button bgColor="bg-sl-white" borderColor="border-sl-blue" onClick={closeModal}>
            취소
          </Button>
          <Button
            bgColor="bg-sl-red"
            borderColor="border-sl-red"
            textColor="text-sl-white"
            onClick={handleDelete}
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
