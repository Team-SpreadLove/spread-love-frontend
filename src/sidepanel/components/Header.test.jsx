import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import useAuthStore from "../../shared/stores/useAuthStore";
import useSummaryStore from "../../shared/stores/useSummaryStore";
import { SUMMARY_STATUS } from "../../shared/constants/index.js";
import Header from "./Header";

describe("Header", () => {
  beforeEach(() => {
    useAuthStore.setState({ isLoggedIn: false });
    useSummaryStore.setState({ summaryStatus: SUMMARY_STATUS.DEFAULT });
  });

  it("로고와 설정 버튼을 표시한다", () => {
    render(
      <MemoryRouter>
        <Header currentPath="/" />
      </MemoryRouter>,
    );

    expect(screen.getByAltText("스프레드 러브")).toBeInTheDocument();
    expect(screen.getByText("설정")).toBeInTheDocument();
  });

  it("비로그인 상태이면 로그인 버튼을 표시한다", () => {
    render(
      <MemoryRouter>
        <Header currentPath="/" />
      </MemoryRouter>,
    );

    expect(screen.getByText("로그인")).toBeInTheDocument();
  });

  it("로그인 상태이면 로그아웃 버튼과 기록 버튼을 표시한다", () => {
    useAuthStore.setState({ isLoggedIn: true });

    render(
      <MemoryRouter>
        <Header currentPath="/" />
      </MemoryRouter>,
    );

    expect(screen.getByText("로그아웃")).toBeInTheDocument();
    expect(screen.getByText("기록")).toBeInTheDocument();
  });

  it("기록 페이지에서는 기록 버튼을 숨긴다", () => {
    useAuthStore.setState({ isLoggedIn: true });

    render(
      <MemoryRouter>
        <Header currentPath="/history" />
      </MemoryRouter>,
    );

    expect(screen.queryByText("기록")).not.toBeInTheDocument();
  });

  it("로딩 중이면 로그인/로그아웃 버튼을 숨긴다", () => {
    useSummaryStore.setState({ summaryStatus: SUMMARY_STATUS.LOADING });

    render(
      <MemoryRouter>
        <Header currentPath="/" />
      </MemoryRouter>,
    );

    expect(screen.queryByText("로그인")).not.toBeInTheDocument();
    expect(screen.queryByText("로그아웃")).not.toBeInTheDocument();
  });

  it("설정 버튼을 클릭하면 옵션 페이지를 연다", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Header currentPath="/" />
      </MemoryRouter>,
    );

    await user.click(screen.getByText("설정"));

    expect(chrome.runtime.openOptionsPage).toHaveBeenCalled();
  });
});
