import { renderHook } from "@testing-library/react";
import useFocusTrap from "./useFocusTrap";

describe("useFocusTrap", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const createFocusableElements = () => {
    const button1 = document.createElement("button");
    button1.textContent = "첫 번째";
    const button2 = document.createElement("button");
    button2.textContent = "두 번째";
    const button3 = document.createElement("button");
    button3.textContent = "세 번째";

    [button1, button2, button3].forEach((button) => {
      Object.defineProperty(button, "offsetParent", {
        configurable: true,
        get: () => container,
      });
    });

    container.append(button1, button2, button3);
    return { button1, button2, button3 };
  };

  it("마지막 요소에서 Tab을 누르면 첫 번째 요소로 포커스가 이동한다", () => {
    const { button1, button3 } = createFocusableElements();

    const containerRef = { current: container };
    const { result } = renderHook(() => useFocusTrap(containerRef));

    button3.focus();

    const event = { key: "Tab", shiftKey: false, preventDefault: vi.fn() };

    result.current(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(button1);
  });

  it("첫 번째 요소에서 Shift+Tab을 누르면 마지막 요소로 포커스가 이동한다", () => {
    const { button1, button3 } = createFocusableElements();

    const containerRef = { current: container };
    const { result } = renderHook(() => useFocusTrap(containerRef));

    button1.focus();

    const event = { key: "Tab", shiftKey: true, preventDefault: vi.fn() };

    result.current(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(button3);
  });

  it("Tab이 아닌 키는 무시한다", () => {
    createFocusableElements();

    const containerRef = { current: container };
    const { result } = renderHook(() => useFocusTrap(containerRef));

    const event = { key: "Enter", shiftKey: false, preventDefault: vi.fn() };

    result.current(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
