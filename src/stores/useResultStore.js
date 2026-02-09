import { create } from "zustand";
import { SUMMARY_STATUS, IMAGE_ANALYSIS_STATUS } from "../constants/index";

const useResultStore = create((set) => ({
  summaryStatus: SUMMARY_STATUS.DEFAULT,
  summaryData: null,
  summaryError: null,

  analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING,
  analysisData: null,

  setSummaryLoading: () => set({ summaryStatus: SUMMARY_STATUS.LOADING, summaryError: null }),
  setSummaryResult: (data) =>
    set((state) => {
      if (state.summaryStatus !== SUMMARY_STATUS.LOADING) {
        return state;
      }

      return { summaryData: data, summaryStatus: SUMMARY_STATUS.RESULT };
    }),
  setSummaryError: (error) => set({ summaryStatus: SUMMARY_STATUS.DEFAULT, summaryError: error }),
  resetSummary: () =>
    set({ summaryStatus: SUMMARY_STATUS.DEFAULT, summaryData: null, summaryError: null }),
  clearSummaryError: () => set({ summaryError: null }),

  setAnalysisResult: (data) =>
    set({ analysisData: data, analysisStatus: IMAGE_ANALYSIS_STATUS.RESULT }),
  setAnalysisError: () => set({ analysisStatus: IMAGE_ANALYSIS_STATUS.ERROR }),
  resetAnalysis: () => set({ analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING, analysisData: null }),
}));

export default useResultStore;
