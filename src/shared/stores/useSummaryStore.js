import { create } from "zustand";
import { SUMMARY_STATUS } from "../constants/index";

const useSummaryStore = create((set) => ({
  summaryStatus: SUMMARY_STATUS.DEFAULT,
  summaryData: null,
  summaryError: null,

  setSummaryLoading: () => set({ summaryStatus: SUMMARY_STATUS.LOADING, summaryError: null }),
  setSummaryResult: (data) =>
    set((state) => {
      if (state.summaryStatus !== SUMMARY_STATUS.LOADING) {
        return state;
      }

      return { summaryData: data, summaryStatus: SUMMARY_STATUS.RESULT };
    }),
  setSummaryError: (error) => set({ summaryStatus: SUMMARY_STATUS.ERROR, summaryError: error }),
  resetSummary: () =>
    set({ summaryStatus: SUMMARY_STATUS.DEFAULT, summaryData: null, summaryError: null }),
  clearSummaryError: () => set({ summaryError: null }),
}));

export default useSummaryStore;
