import { create } from "zustand";
import { SUMMARY_STATUS, IMAGE_ANALYSIS_STATUS } from "../constants/index";

const useResultStore = create((set) => ({
  summaryStatus: SUMMARY_STATUS.DEFAULT,
  summaryData: null,

  analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING,
  analysisData: null,

  setSummaryLoading: () => set({ summaryStatus: SUMMARY_STATUS.LOADING }),
  setSummaryResult: (data) =>
    set((state) => {
      if (state.summaryStatus !== SUMMARY_STATUS.LOADING) {
        return state;
      }

      return { summaryData: data, summaryStatus: SUMMARY_STATUS.RESULT };
    }),
  setSummaryError: () => set({ summaryStatus: SUMMARY_STATUS.ERROR }),
  resetSummary: () => set({ summaryStatus: SUMMARY_STATUS.DEFAULT, summaryData: null }),

  setAnalysisResult: (data) =>
    set({ analysisData: data, analysisStatus: IMAGE_ANALYSIS_STATUS.RESULT }),
  setAnalysisError: () => set({ analysisStatus: IMAGE_ANALYSIS_STATUS.ERROR }),
  resetAnalysis: () => set({ analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING, analysisData: null }),
}));

export default useResultStore;
