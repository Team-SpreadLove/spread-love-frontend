import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Logo from "./Logo";

describe("Logo", () => {
  it("로고 이미지와 텍스트를 표시한다", () => {
    render(
      <MemoryRouter>
        <Logo iconSize={32} textSize={16} spacing="ml-1" />
      </MemoryRouter>,
    );

    expect(screen.getByAltText("스프레드 러브")).toBeInTheDocument();
    expect(screen.getByText("Spread")).toBeInTheDocument();
    expect(screen.getByText("Love")).toBeInTheDocument();
  });

  it("useRouter가 false이면 링크 없이 렌더링한다", () => {
    render(<Logo iconSize={32} textSize={16} spacing="ml-1" useRouter={false} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Spread")).toBeInTheDocument();
  });
});
