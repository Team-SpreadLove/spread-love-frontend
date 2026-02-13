import useModalStore from "./useModalStore";

describe("useModalStore", () => {
  beforeEach(() => {
    useModalStore.setState({ isModalOpen: false });
  });

  describe("openModal", () => {
    it("isModalOpen을 true로 변경한다", () => {
      const { openModal } = useModalStore.getState();
      openModal();

      const state = useModalStore.getState();
      expect(state.isModalOpen).toBe(true);
    });
  });

  describe("closeModal", () => {
    it("isModalOpen을 false로 변경한다", () => {
      useModalStore.setState({ isModalOpen: true });

      const { closeModal } = useModalStore.getState();
      closeModal();

      const state = useModalStore.getState();
      expect(state.isModalOpen).toBe(false);
    });
  });
});
