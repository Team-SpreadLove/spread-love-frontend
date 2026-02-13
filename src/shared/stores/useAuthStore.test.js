import useAuthStore from "./useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ isLoggedIn: false });
  });

  it("초기 상태는 false이다", () => {
    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
  });

  describe("setIsLoggedIn", () => {
    it("로그인 상태를 변경한다", () => {
      const { setIsLoggedIn } = useAuthStore.getState();
      setIsLoggedIn(true);

      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(true);
    });
  });
});
