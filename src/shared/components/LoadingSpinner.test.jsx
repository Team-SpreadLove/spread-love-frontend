import { render, screen } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("로딩 중일 때 안내 문구를 표시한다", () => {
    const loadingText = "페이지를 요약중입니다...";

    render(<LoadingSpinner message={loadingText} />);

    expect(screen.getByText(loadingText)).toBeInTheDocument();
  });
});
