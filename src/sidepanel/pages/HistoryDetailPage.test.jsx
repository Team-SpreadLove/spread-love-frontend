import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import HistoryDetailPage from "./HistoryDetailPage";

const mockHistory = {
  id: "1",
  createdAt: "2026-02-13T10:00:00Z",
  contents: { title: "테스트 제목", summary: "요약 본문입니다" },
};

describe("HistoryDetailPage", () => {
  it("기록 상세 정보를 표시한다", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/history/1", state: { history: mockHistory } }]}>
        <HistoryDetailPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("테스트 제목")).toBeInTheDocument();
    expect(screen.getByText("요약 본문입니다")).toBeInTheDocument();
    expect(screen.getByText("목록으로")).toBeInTheDocument();
  });

  it("기록 데이터가 없으면 안내 메시지를 표시한다", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/history/1" }]}>
        <HistoryDetailPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("기록을 찾을 수 없습니다")).toBeInTheDocument();
  });
});
