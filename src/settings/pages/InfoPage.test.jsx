import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InfoPage from "./InfoPage";

describe("InfoPage", () => {
  it("정보 페이지 링크 버튼들을 렌더링한다", () => {
    render(<InfoPage />);

    expect(screen.getByRole("button", { name: "사용 방법" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "버그 제보" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Github" })).toBeInTheDocument();
  });

  it("링크 버튼 클릭 시 새 탭을 연다", async () => {
    const user = userEvent.setup();

    render(<InfoPage />);

    await user.click(screen.getByRole("button", { name: "Github" }));

    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: "https://github.com/SpreadLoveProject/spread-love-frontend",
    });
  });
});
