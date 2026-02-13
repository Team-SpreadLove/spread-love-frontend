import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    },
    sync: {
      get: vi.fn(),
    },
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },
  runtime: {
    sendMessage: vi.fn(),
    getURL: vi.fn(),
    onMessage: { addListener: vi.fn() },
    onConnect: { addListener: vi.fn() },
    openOptionsPage: vi.fn(),
  },
  tabs: {
    query: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  sidePanel: {
    open: vi.fn(),
    setPanelBehavior: vi.fn().mockReturnValue(Promise.resolve()),
  },
  commands: {
    onCommand: { addListener: vi.fn() },
  },
};
