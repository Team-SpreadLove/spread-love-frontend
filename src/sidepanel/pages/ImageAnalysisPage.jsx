import { useState, useEffect, useCallback } from "react";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorMessage from "../../shared/components/ErrorMessage";
import { IMAGE_ANALYSIS_STATUS } from "../../shared/constants/index";
import useAnalysisStore from "../../shared/stores/useAnalysisStore";

const ImageAnalysisPage = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { analysisStatus, analysisData, setAnalysisResult, setAnalysisError } = useAnalysisStore();

  const resultRef = useCallback((node) => {
    if (node) node.focus();
  }, []);

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
      <div aria-live="polite" className="sr-only">
        {analysisStatus === IMAGE_ANALYSIS_STATUS.LOADING &&
          "이미지를 분석중입니다. 잠시만 기다려주세요."}
        {analysisStatus === IMAGE_ANALYSIS_STATUS.ERROR && errorMessage}
      </div>
      {analysisStatus === IMAGE_ANALYSIS_STATUS.LOADING && (
        <LoadingSpinner message="이미지를 분석중입니다..." />
      )}

      {analysisStatus === IMAGE_ANALYSIS_STATUS.RESULT && analysisData && (
        <div
          ref={resultRef}
          tabIndex={0}
          className="flex flex-col gap-4 focus-visible:ring-2 focus-visible:ring-sl-blue outline-none"
        >
          <h1 className="text-3xl">{analysisData.title}</h1>
          <p className="text-2xl">{analysisData.summary}</p>
        </div>
      )}

      {analysisStatus === IMAGE_ANALYSIS_STATUS.ERROR && (
        <ErrorMessage message={errorMessage} className="mt-4" />
      )}
    </div>
  );
};

export default ImageAnalysisPage;
