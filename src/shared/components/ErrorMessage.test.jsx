import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("에러 메시지를 전달하면 화면에 표시한다", () => {
    const errorText = "요약에 실패했습니다";

    render(<ErrorMessage message={errorText} />);

    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  it("에러 메시지가 없으면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(<ErrorMessage />);

    expect(container.firstChild).toBeNull();
  });

  it("에러 메시지가 스크린 리더에 자동으로 전달된다", () => {
    render(<ErrorMessage message="에러" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
