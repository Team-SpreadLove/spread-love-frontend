import { render, screen } from "@testing-library/react";
import NoData from "./NoData";

describe("NoData", () => {
  it("데이터가 없을 때 안내 문구를 표시한다", () => {
    const noDataText = "기록이 없습니다";

    render(<NoData message={noDataText} />);

    expect(screen.getByText(noDataText)).toBeInTheDocument();
  });

  it("빈 상태 메시지가 스크린 리더에 전달된다", () => {
    render(<NoData message="데이터 없음" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
