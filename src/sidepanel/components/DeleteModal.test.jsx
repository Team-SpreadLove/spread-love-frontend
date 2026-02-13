import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import DeleteModal from "./DeleteModal";
import useModalStore from "../../shared/stores/useModalStore";
import useSummaryStore from "../../shared/stores/useSummaryStore";
import useAnalysisStore from "../../shared/stores/useAnalysisStore";
import { SUMMARY_STATUS, IMAGE_ANALYSIS_STATUS } from "../../shared/constants";

const renderWithRoute = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div>요약 홈</div>
              <DeleteModal />
            </>
          }
        />
        <Route
          path="/analysis"
          element={
            <>
              <div>분석 화면</div>
              <DeleteModal />
            </>
          }
        />
        <Route
          path="/history/:id"
          element={
            <>
              <div>상세 화면</div>
              <DeleteModal />
            </>
          }
        />
        <Route path="/history" element={<div>히스토리 목록</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("DeleteModal", () => {
  beforeEach(() => {
    useModalStore.setState({ isModalOpen: true });
    useSummaryStore.setState({
      summaryStatus: SUMMARY_STATUS.RESULT,
      summaryData: { historyId: "history-1", title: "제목", summary: "요약" },
      summaryError: null,
    });
    useAnalysisStore.setState({
      analysisStatus: IMAGE_ANALYSIS_STATUS.RESULT,
      analysisData: { data: { historyId: "analysis-1" }, summary: "분석 요약" },
    });
  });

  it("삭제 실패 시 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();
    chrome.runtime.sendMessage.mockImplementation((_, callback) => {
      callback({ success: false, error: "삭제 실패" });
    });

    renderWithRoute("/");

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("삭제 실패");
  });

  it("히스토리 상세에서 삭제 성공 시 목록 페이지로 이동한다", async () => {
    const user = userEvent.setup();
    chrome.runtime.sendMessage.mockImplementation((_, callback) => {
      callback({ success: true });
    });

    renderWithRoute("/history/123");

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      { type: "DELETE_HISTORY", payload: { historyId: "123" } },
      expect.any(Function),
    );
    expect(await screen.findByText("히스토리 목록")).toBeInTheDocument();
  });

  it("분석 화면에서 삭제 성공 시 분석 상태를 초기화하고 홈으로 이동한다", async () => {
    const user = userEvent.setup();
    chrome.runtime.sendMessage.mockImplementation((_, callback) => {
      callback({ success: true });
    });

    renderWithRoute("/analysis");

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      { type: "DELETE_HISTORY", payload: { historyId: "analysis-1" } },
      expect.any(Function),
    );
    expect(useAnalysisStore.getState().analysisStatus).toBe(IMAGE_ANALYSIS_STATUS.LOADING);
    expect(await screen.findByText("요약 홈")).toBeInTheDocument();
  });
});
