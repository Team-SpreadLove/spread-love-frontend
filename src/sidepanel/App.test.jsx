import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import App from "./App";
import useAuthStore from "../shared/stores/useAuthStore";
import useSummaryStore from "../shared/stores/useSummaryStore";
import useAnalysisStore from "../shared/stores/useAnalysisStore";
import useModalStore from "../shared/stores/useModalStore";
import { SUMMARY_STATUS, IMAGE_ANALYSIS_STATUS } from "../shared/constants";

const { mockFetchRateLimit } = vi.hoisted(() => ({
  mockFetchRateLimit: vi.fn(),
}));

vi.mock("../shared/api/client", () => ({
  fetchRateLimit: mockFetchRateLimit,
}));

const renderAppAt = (initialPath = "/") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<div>요약 페이지</div>} />
          <Route path="analysis" element={<div>분석 페이지</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe("App", () => {
  beforeEach(() => {
    useAuthStore.setState({ isLoggedIn: false });
    useSummaryStore.setState({
      summaryStatus: SUMMARY_STATUS.DEFAULT,
      summaryData: null,
      summaryError: null,
    });
    useAnalysisStore.setState({
      analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING,
      analysisData: null,
    });
    useModalStore.setState({ isModalOpen: false });

    chrome.storage.local.get.mockImplementation((key, callback) => {
      if (typeof callback === "function") {
        if (key === "userToken") callback({ userToken: "user-token" });
        else if (key === "remainingCount") callback({ remainingCount: 3 });
        else callback({});
        return;
      }

      if (key === "pendingImageAnalysis") return Promise.resolve({});
      return Promise.resolve({});
    });
  });

  it("초기 렌더 시 로그인 상태를 설정하고 공통 UI를 렌더링한다", async () => {
    renderAppAt("/");

    expect(screen.getByText("요약 페이지")).toBeInTheDocument();

    await waitFor(() => {
      expect(useAuthStore.getState().isLoggedIn).toBe(true);
    });

    expect(mockFetchRateLimit).toHaveBeenCalled();
    expect(chrome.storage.onChanged.addListener).toHaveBeenCalledWith(expect.any(Function));
  });

  it("pendingImageAnalysis가 있으면 분석 페이지로 이동한다", async () => {
    chrome.storage.local.get.mockImplementation((key, callback) => {
      if (typeof callback === "function") {
        if (key === "userToken") callback({});
        else if (key === "remainingCount") callback({ remainingCount: 1 });
        else callback({});
        return;
      }

      if (key === "pendingImageAnalysis") {
        return Promise.resolve({ pendingImageAnalysis: { imageUrl: "https://example.com/a.jpg" } });
      }
      return Promise.resolve({});
    });

    renderAppAt("/");

    expect(await screen.findByText("분석 페이지")).toBeInTheDocument();
  });
});
