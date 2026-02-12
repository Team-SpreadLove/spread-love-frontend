import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DeleteModal from "./components/DeleteModal";
import useAuthStore from "../shared/stores/useAuthStore";
import useSummaryStore from "../shared/stores/useSummaryStore";
import useModalStore from "../shared/stores/useModalStore";
import useFocusTrap from "../shared/hooks/useFocusTrap";
import { fetchRateLimit } from "../shared/api/client";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthStore();
  const { clearSummaryError } = useSummaryStore();
  const { isModalOpen } = useModalStore();
  const panelRef = useRef(null);
  const prevModalOpenRef = useRef(false);
  const handleKeyDown = useFocusTrap(panelRef);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  useEffect(() => {
    if (prevModalOpenRef.current && !isModalOpen) {
      panelRef.current?.focus();
    }
    prevModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  useEffect(() => {
    let isMounted = true;

    chrome.storage.local.get("userToken", (result) => {
      if (isMounted) {
        setIsLoggedIn(Boolean(result.userToken));
      }
    });

    fetchRateLimit();

    const handleStorageChange = (changes) => {
      if (!isMounted) return;

      if (changes.userToken) {
        setIsLoggedIn(Boolean(changes.userToken.newValue));
        fetchRateLimit();
        clearSummaryError();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkPendingAnalysis = async () => {
      const { pendingImageAnalysis } = await chrome.storage.local.get("pendingImageAnalysis");

      if (isMounted && pendingImageAnalysis) {
        navigate("/analysis");
      }
    };

    checkPendingAnalysis();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div
        ref={panelRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="flex flex-col h-screen gap-5 p-5 focus-visible:ring-2 focus-visible:ring-sl-blue outline-none"
      >
        <Header currentPath={location.pathname} />
        <main className="flex flex-col items-center gap-2 w-full h-full p-3 border border-sl-blue rounded-xl overflow-y-auto">
          <Outlet />
        </main>
        <Footer currentPath={location.pathname} />
      </div>
      <DeleteModal />
    </>
  );
};

export default App;
