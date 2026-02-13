import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("totalPages가 1 이하이면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("현재 페이지가 강조 표시된다", () => {
    const currentPage = 2;

    render(<Pagination currentPage={currentPage} totalPages={5} onPageChange={() => {}} />);

    const currentButton = screen.getByRole("button", { name: String(currentPage) });
    expect(currentButton).toHaveAttribute("aria-current", "page");
  });

  it("페이지 버튼 클릭 시 onPageChange가 호출된다", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    const targetPage = 3;

    render(<Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />);

    await user.click(screen.getByRole("button", { name: String(targetPage) }));

    expect(handlePageChange).toHaveBeenCalledWith(targetPage);
  });
});
