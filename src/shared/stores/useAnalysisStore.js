import { create } from "zustand";
import { IMAGE_ANALYSIS_STATUS } from "../constants/index";

const useAnalysisStore = create((set) => ({
  analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING,
  analysisData: null,

  setAnalysisResult: (data) =>
    set({ analysisData: data, analysisStatus: IMAGE_ANALYSIS_STATUS.RESULT }),
  setAnalysisError: () => set({ analysisStatus: IMAGE_ANALYSIS_STATUS.ERROR }),
  resetAnalysis: () => set({ analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING, analysisData: null }),
}));

export default useAnalysisStore;
