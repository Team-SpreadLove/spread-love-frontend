import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useAuthStore from "../../shared/stores/useAuthStore";
import useSummaryStore from "../../shared/stores/useSummaryStore";
import useAnalysisStore from "../../shared/stores/useAnalysisStore";
import useModalStore from "../../shared/stores/useModalStore";
import { SUMMARY_STATUS, IMAGE_ANALYSIS_STATUS } from "../../shared/constants/index.js";
import Footer from "./Footer";

describe("Footer", () => {
  beforeEach(() => {
    useAuthStore.setState({ isLoggedIn: false });
    useSummaryStore.setState({ summaryStatus: SUMMARY_STATUS.DEFAULT });
    useAnalysisStore.setState({ analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING });
    useModalStore.setState({ isModalOpen: false });

    chrome.storage.local.get.mockImplementation((key, callback) => {
      callback({ remainingCount: null });
    });
    chrome.storage.onChanged.addListener.mockImplementation(() => {});
    chrome.storage.onChanged.removeListener.mockImplementation(() => {});
  });

  it("닫기 버튼을 표시한다", () => {
    render(<Footer currentPath="/" />);

    expect(screen.getByText("닫기")).toBeInTheDocument();
  });

  it("남은 횟수가 있으면 표시한다", () => {
    chrome.storage.local.get.mockImplementation((key, callback) => {
      callback({ remainingCount: 5 });
    });

    render(<Footer currentPath="/" />);

    expect(screen.getByText(/남은 횟수: 5/)).toBeInTheDocument();
  });

  it("로그인 + 요약 결과 상태에서 삭제 버튼을 표시한다", () => {
    useAuthStore.setState({ isLoggedIn: true });
    useSummaryStore.setState({ summaryStatus: SUMMARY_STATUS.RESULT });

    render(<Footer currentPath="/" />);

    expect(screen.getByText("삭제")).toBeInTheDocument();
  });

  it("비로그인 상태에서는 삭제 버튼을 숨긴다", () => {
    useSummaryStore.setState({ summaryStatus: SUMMARY_STATUS.RESULT });

    render(<Footer currentPath="/" />);

    expect(screen.queryByText("삭제")).not.toBeInTheDocument();
  });

  it("삭제 버튼 클릭 시 모달을 연다", async () => {
    const user = userEvent.setup();

    useAuthStore.setState({ isLoggedIn: true });
    useSummaryStore.setState({ summaryStatus: SUMMARY_STATUS.RESULT });

    render(<Footer currentPath="/" />);

    await user.click(screen.getByText("삭제"));

    const { isModalOpen } = useModalStore.getState();
    expect(isModalOpen).toBe(true);
  });
});
