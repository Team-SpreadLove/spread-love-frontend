import { useState, useEffect } from "react";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import { IMAGE_ANALYSIS_STATUS } from "../../shared/constants/index";
import useAnalysisStore from "../../shared/stores/useAnalysisStore";

const ImageAnalysisPage = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { analysisStatus, analysisData, setAnalysisResult, setAnalysisError } = useAnalysisStore();

  useEffect(() => {
    let isActive = true;

    const analyzeImage = async () => {
      const { pendingImageAnalysis } = await chrome.storage.local.get("pendingImageAnalysis");

      await chrome.storage.local.remove("pendingImageAnalysis");

      if (!isActive) return;

      if (!pendingImageAnalysis) {
        setErrorMessage("분석할 이미지 정보가 없습니다. 이미지를 선택 후 단축키를 눌러주세요");
        setAnalysisError();

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
            setAnalysisResult(response.data);
          } else {
            setErrorMessage(
              response?.error ||
                "이미지 분석에 실패했습니다. 이미지를 다시 선택 후 단축키를 눌러주세요.",
            );
            setAnalysisError();
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
          <h1 className="text-3xl">{analysisData.title}</h1>
          <p className="text-2xl">{analysisData.summary}</p>
        </div>
      )}

      {analysisStatus === IMAGE_ANALYSIS_STATUS.ERROR && (
        <p role="alert" className="mt-4 text-sl-red text-lg">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default ImageAnalysisPage;
