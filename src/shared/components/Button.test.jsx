import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Button from "./Button";

describe("Button", () => {
  it("링크 경로 없이 사용하면 button 요소를 렌더링한다", () => {
    render(<Button>클릭</Button>);

    expect(screen.getByRole("button", { name: "클릭" })).toBeInTheDocument();
  });

  it("링크 경로와 함께 사용하면 Link 요소를 렌더링한다", () => {
    render(
      <MemoryRouter>
        <Button to="/history">기록</Button>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "기록" })).toBeInTheDocument();
  });

  it("클릭 시 onClick 핸들러가 호출된다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>클릭</Button>);

    await user.click(screen.getByRole("button", { name: "클릭" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
