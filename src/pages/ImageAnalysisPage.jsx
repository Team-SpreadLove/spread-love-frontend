import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { IMAGE_ANALYSIS_STATUS } from "../constants/index";

const ImageAnalysisPage = () => {
  const { analysisStatus, setAnalysisStatus, analysisData, setAnalysisData } = useOutletContext();
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const analyzeImage = async () => {
      const { pendingImageAnalysis } = await chrome.storage.local.get("pendingImageAnalysis");

      if (!isActive) return;

      if (!pendingImageAnalysis) {
        setError("분석할 이미지 정보가 없습니다");
        setAnalysisStatus(IMAGE_ANALYSIS_STATUS.ERROR);

        return;
      }

      chrome.runtime.sendMessage(
        {
          type: "ANALYZE_IMAGE",
          payload: {
            imageUrl: pendingImageAnalysis.imageUrl,
            pageUrl: pendingImageAnalysis.pageUrl,
          },
        },
        (response) => {
          if (!isActive) return;

          chrome.storage.local.remove("pendingImageAnalysis");

          if (response && response.success) {
            console.log("[Spread Love] 분석 결과:", response.data);
            setAnalysisData(response.data);
            setAnalysisStatus(IMAGE_ANALYSIS_STATUS.RESULT);
          } else {
            setError(response?.error || "이미지 분석에 실패했습니다");
            setAnalysisStatus(IMAGE_ANALYSIS_STATUS.ERROR);
          }
        },
      );
    };

    analyzeImage();

    return () => {
      isActive = false;
    };
  }, []);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {analysisStatus === IMAGE_ANALYSIS_STATUS.LOADING && (
        <LoadingSpinner message="이미지를 분석중입니다..." />
      )}

      {analysisStatus === IMAGE_ANALYSIS_STATUS.RESULT && analysisData && (
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px]">{analysisData.data.title}</h1>
          <p className="text-2xl">{analysisData.data.summary}</p>
        </div>
      )}

      {analysisStatus === IMAGE_ANALYSIS_STATUS.ERROR && (
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px] font-bold text-sl-red">오류</h1>
          <p className="text-xl">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageAnalysisPage;
