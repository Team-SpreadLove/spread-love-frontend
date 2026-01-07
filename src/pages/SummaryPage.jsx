import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { SUMMARY_STATUS_FLOW } from "../constants/Index";
import { mockSummaryResponse } from "../mocks/summaryMock";

const SummaryPage = () => {
  const [statusIndex, setStatusIndex] = useState(2);
  const [summaryData] = useState(mockSummaryResponse.data);

  const currentStatus = SUMMARY_STATUS_FLOW[statusIndex];

  const handleSummaryClick = () => {
    setStatusIndex(1);
  };

  return (
    <>
      {currentStatus === "default" && (
        <button
          type="button"
          onClick={handleSummaryClick}
          className="flex items-center justify-center gap-2 w-full h-[30px] bg-sl-blue border rounded-2xl font-medium text-white"
        >
          <img src="/images/icons/spreadlove-summary-16.svg" alt="요약 아이콘" aria-hidden="true" />
          <span>이 페이지 요약하기</span>
        </button>
      )}
      {currentStatus === "loading" && <LoadingSpinner message={"페이지를 요약중입니다..."} />}
      {currentStatus === "result" && (
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px]">{summaryData.title}</h1>
          <p className="text-2xl">{summaryData.summary}</p>
        </div>
      )}
    </>
  );
};

export default SummaryPage;
