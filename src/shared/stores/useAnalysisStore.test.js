import useAnalysisStore from "./useAnalysisStore";
import { IMAGE_ANALYSIS_STATUS } from "../constants/index";

describe("useAnalysisStore", () => {
  beforeEach(() => {
    useAnalysisStore.setState({
      analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING,
      analysisData: null,
    });
  });

  describe("setAnalysisResult", () => {
    it("분석 데이터와 상태를 result로 변경한다", () => {
      const analysisData = { title: "이미지 제목", description: "이미지 해설" };

      const { setAnalysisResult } = useAnalysisStore.getState();
      setAnalysisResult(analysisData);

      const state = useAnalysisStore.getState();
      expect(state.analysisStatus).toBe(IMAGE_ANALYSIS_STATUS.RESULT);
      expect(state.analysisData).toEqual(analysisData);
    });
  });

  describe("setAnalysisError", () => {
    it("상태를 error로 변경한다", () => {
      const { setAnalysisError } = useAnalysisStore.getState();
      setAnalysisError();

      const state = useAnalysisStore.getState();
      expect(state.analysisStatus).toBe(IMAGE_ANALYSIS_STATUS.ERROR);
    });
  });

  describe("resetAnalysis", () => {
    it("상태를 loading으로, 데이터를 초기화한다", () => {
      useAnalysisStore.setState({
        analysisStatus: IMAGE_ANALYSIS_STATUS.RESULT,
        analysisData: { title: "제목", description: "해설" },
      });

      const { resetAnalysis } = useAnalysisStore.getState();
      resetAnalysis();

      const state = useAnalysisStore.getState();
      expect(state.analysisStatus).toBe(IMAGE_ANALYSIS_STATUS.LOADING);
      expect(state.analysisData).toBeNull();
    });
  });
});
