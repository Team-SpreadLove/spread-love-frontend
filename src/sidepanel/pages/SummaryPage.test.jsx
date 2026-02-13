import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SUMMARY_STATUS } from "../../shared/constants/index";
import useSummaryStore from "../../shared/stores/useSummaryStore";
import SummaryPage from "./SummaryPage";

describe("SummaryPage", () => {
  beforeEach(() => {
    useSummaryStore.setState({
      summaryStatus: SUMMARY_STATUS.DEFAULT,
      summaryData: null,
      summaryError: null,
    });
  });

  it("요약 버튼을 클릭하면 background에 SUMMARIZE 메시지를 전송한다", async () => {
    const user = userEvent.setup();

    chrome.runtime.sendMessage.mockImplementation((message, callback) => {
      callback({ success: true, data: { title: "제목", summary: "요약" } });
    });

    render(<SummaryPage />);

    await user.click(screen.getByRole("button", { name: /이 페이지 요약하기/i }));

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      { type: "SUMMARIZE" },
      expect.any(Function),
    );
  });

  it("로딩 중이면 로딩 스피너를 표시한다", () => {
    useSummaryStore.setState({ summaryStatus: SUMMARY_STATUS.LOADING });

    render(<SummaryPage />);

    expect(screen.getByText("페이지를 요약중입니다...")).toBeInTheDocument();
  });

  it("페이지 요약에 성공하면 제목과 요약 텍스트를 표시한다", () => {
    useSummaryStore.setState({
      summaryStatus: SUMMARY_STATUS.RESULT,
      summaryData: { title: "테스트 제목", summary: "테스트 요약 내용" },
    });

    render(<SummaryPage />);

    expect(screen.getByText("테스트 제목")).toBeInTheDocument();
    expect(screen.getByText("테스트 요약 내용")).toBeInTheDocument();
  });

  it("에러가 발생하면 에러 메시지와 요약 버튼을 함께 표시한다", () => {
    const errorText = "페이지 요약에 실패했습니다.";

    useSummaryStore.setState({
      summaryStatus: SUMMARY_STATUS.ERROR,
      summaryError: errorText,
    });

    render(<SummaryPage />);

    expect(screen.getByRole("alert")).toHaveTextContent(errorText);
    expect(screen.getByRole("button", { name: /이 페이지 요약하기/i })).toBeInTheDocument();
  });
});
