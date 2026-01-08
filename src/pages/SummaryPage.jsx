import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { SUMMARY_STATUS_FLOW, TEST_DATA } from "../constants/Index";

const blobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const SummaryPage = () => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [summaryData, setSummaryData] = useState(null);

  const currentStatus = SUMMARY_STATUS_FLOW[statusIndex];

  const handleSummaryClick = async () => {
    setStatusIndex(1);

    const testItem = TEST_DATA.MUSINSA;
    const response = await fetch(testItem.image);
    const testItemImageBlob = await response.blob();
    const imageBase64 = await blobToBase64(testItemImageBlob);

    chrome.runtime.sendMessage(
      {
        type: "SUMMARIZE",
        payload: {
          url: testItem.url,
          imageBase64: imageBase64,
        },
      },
      (response) => {
        if (response?.success) {
          setSummaryData(response.data);
          setStatusIndex(2);
        } else {
          console.error("요약 실패:", response?.error);
          setStatusIndex(0);
        }
      },
    );
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
      {currentStatus === "result" && summaryData && (
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px]">{summaryData.title}</h1>
          <p className="text-2xl">{summaryData.summary}</p>
        </div>
      )}
    </>
  );
};
export default SummaryPage;
