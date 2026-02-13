import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GeneralPage from "./GeneralPage";

describe("GeneralPage", () => {
  beforeEach(() => {
    chrome.storage.sync.get.mockImplementation((_, callback) => callback({}));
    chrome.storage.sync.set.mockImplementation((_, callback) => callback());
  });

  it("저장된 설정이 없으면 기본값을 표시한다", async () => {
    render(<GeneralPage />);

    const [lengthSelect, personaSelect] = await screen.findAllByRole("combobox");
    expect(lengthSelect).toHaveValue("medium");
    expect(personaSelect).toHaveValue("default");
  });

  it("저장된 설정이 있으면 해당 값을 로드한다", async () => {
    chrome.storage.sync.get.mockImplementation((_, callback) => {
      callback({ settings: { length: "long", persona: "professional" } });
    });

    render(<GeneralPage />);

    await waitFor(() => {
      const [lengthSelect, personaSelect] = screen.getAllByRole("combobox");
      expect(lengthSelect).toHaveValue("long");
      expect(personaSelect).toHaveValue("professional");
    });
  });

  it("값을 변경하고 저장하면 storage.sync.set을 호출한다", async () => {
    const user = userEvent.setup();
    render(<GeneralPage />);

    const [lengthSelect, personaSelect] = await screen.findAllByRole("combobox");
    await user.selectOptions(lengthSelect, "short");
    await user.selectOptions(personaSelect, "friendly");
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(chrome.storage.sync.set).toHaveBeenCalledWith(
      { settings: { length: "short", persona: "friendly" } },
      expect.any(Function),
    );
    expect(await screen.findByRole("status")).toHaveTextContent("설정이 저장되었습니다.");
  });

  it("단축키 설정 버튼 클릭 시 확장 프로그램 페이지를 연다", async () => {
    const user = userEvent.setup();

    render(<GeneralPage />);

    await user.click(screen.getByRole("button", { name: "단축키 설정" }));

    expect(chrome.tabs.create).toHaveBeenCalledWith({ url: "chrome://extensions/shortcuts" });
  });
});
