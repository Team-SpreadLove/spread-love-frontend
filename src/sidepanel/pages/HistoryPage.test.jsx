import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import HistoryPage from "./HistoryPage";

const mockHistories = [
  {
    id: "1",
    createdAt: "2026-02-13T10:00:00Z",
    contents: { title: "첫 번째 요약" },
  },
  {
    id: "2",
    createdAt: "2026-02-12T10:00:00Z",
    contents: { title: "두 번째 요약" },
  },
];

describe("HistoryPage", () => {
  beforeEach(() => {
    chrome.runtime.sendMessage.mockReset();
  });

  it("로딩 중이면 로딩 스피너를 표시한다", () => {
    chrome.runtime.sendMessage.mockImplementation(() => {});

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("전체 목록을 불러오는 중입니다...")).toBeInTheDocument();
  });

  it("기록 목록을 표시한다", async () => {
    chrome.runtime.sendMessage.mockImplementation((message, callback) => {
      callback({
        success: true,
        data: {
          histories: mockHistories,
          pagination: { totalPages: 1 },
        },
      });
    });

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/첫 번째 요약/)).toBeInTheDocument();
    expect(screen.getByText(/두 번째 요약/)).toBeInTheDocument();
  });

  it("기록이 없으면 빈 상태 메시지를 표시한다", async () => {
    chrome.runtime.sendMessage.mockImplementation((message, callback) => {
      callback({
        success: true,
        data: {
          histories: [],
          pagination: { totalPages: 1 },
        },
      });
    });

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("기록이 없습니다")).toBeInTheDocument();
  });

  it("에러 응답이 오면 에러 메시지를 표시한다", async () => {
    const errorText = "기록을 불러오는데 실패했습니다.";

    chrome.runtime.sendMessage.mockImplementation((message, callback) => {
      callback({ success: false, error: errorText });
    });

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText(errorText)).toBeInTheDocument();
  });
});
