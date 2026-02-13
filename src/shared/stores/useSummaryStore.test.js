import useSummaryStore from "./useSummaryStore";
import { SUMMARY_STATUS } from "../constants/index";

describe("useSummaryStore", () => {
  beforeEach(() => {
    useSummaryStore.setState({
      summaryStatus: SUMMARY_STATUS.DEFAULT,
      summaryData: null,
      summaryError: null,
    });
  });

  describe("setSummaryLoading", () => {
    it("상태를 loading으로 변경하고 에러를 초기화한다", () => {
      useSummaryStore.setState({ summaryError: "이전 에러" });

      const { setSummaryLoading } = useSummaryStore.getState();
      setSummaryLoading();

      const state = useSummaryStore.getState();
      expect(state.summaryStatus).toBe(SUMMARY_STATUS.LOADING);
      expect(state.summaryError).toBeNull();
    });
  });

  describe("setSummaryResult", () => {
    it("loading 상태에서만 결과를 저장한다", () => {
      useSummaryStore.setState({ summaryStatus: SUMMARY_STATUS.LOADING });
      const summaryData = { title: "테스트 제목", summary: "테스트 요약" };

      const { setSummaryResult } = useSummaryStore.getState();
      setSummaryResult(summaryData);

      const state = useSummaryStore.getState();
      expect(state.summaryStatus).toBe(SUMMARY_STATUS.RESULT);
      expect(state.summaryData).toEqual(summaryData);
    });

    it("loading이 아닌 상태에서는 결과를 무시한다", () => {
      useSummaryStore.setState({ summaryStatus: SUMMARY_STATUS.DEFAULT });
      const summaryData = { title: "테스트 제목", summary: "테스트 요약" };

      const { setSummaryResult } = useSummaryStore.getState();
      setSummaryResult(summaryData);

      const state = useSummaryStore.getState();
      expect(state.summaryStatus).toBe(SUMMARY_STATUS.DEFAULT);
      expect(state.summaryData).toBeNull();
    });
  });

  describe("setSummaryError", () => {
    it("에러 상태와 에러 메시지를 저장한다", () => {
      const errorMessage = "요약에 실패했습니다";

      const { setSummaryError } = useSummaryStore.getState();
      setSummaryError(errorMessage);

      const state = useSummaryStore.getState();
      expect(state.summaryStatus).toBe(SUMMARY_STATUS.ERROR);
      expect(state.summaryError).toBe(errorMessage);
    });
  });

  describe("resetSummary", () => {
    it("모든 상태를 초기값으로 되돌린다", () => {
      useSummaryStore.setState({
        summaryStatus: SUMMARY_STATUS.RESULT,
        summaryData: { title: "제목", summary: "요약" },
        summaryError: "에러",
      });

      const { resetSummary } = useSummaryStore.getState();
      resetSummary();

      const state = useSummaryStore.getState();
      expect(state.summaryStatus).toBe(SUMMARY_STATUS.DEFAULT);
      expect(state.summaryData).toBeNull();
      expect(state.summaryError).toBeNull();
    });
  });

  describe("clearSummaryError", () => {
    it("에러 메시지만 초기화한다", () => {
      useSummaryStore.setState({
        summaryStatus: SUMMARY_STATUS.ERROR,
        summaryError: "에러 메시지",
      });

      const { clearSummaryError } = useSummaryStore.getState();
      clearSummaryError();

      const state = useSummaryStore.getState();
      expect(state.summaryError).toBeNull();
      expect(state.summaryStatus).toBe(SUMMARY_STATUS.ERROR);
    });
  });
});
