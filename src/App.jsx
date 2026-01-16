import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DeleteModal from "./components/DeleteModal";
import { ERROR_MESSAGES } from "./constants/index.js";
import useAuthStore from "./stores/useAuthStore";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    chrome.storage.local.get("token", (result) => {
      if (isMounted) {
        setIsLoggedIn(Boolean(result.token));
      }
    });

    const handleStorageChange = (changes) => {
      if (changes.token && isMounted) {
        setIsLoggedIn(Boolean(changes.token.newValue));
      }

      if (changes.rateLimitExceeded && changes.rateLimitExceeded.newValue === true && isMounted) {
        alert(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        chrome.storage.local.remove("rateLimitExceeded");
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
    <div className="flex flex-col h-screen gap-5 p-5">
      <Header currentPath={location.pathname} />
      <main className="flex flex-col items-center gap-2 w-full h-full p-3 border border-sl-blue rounded-xl overflow-y-auto">
        <Outlet />
      </main>
      <Footer currentPath={location.pathname} />
      <DeleteModal />
    </div>
  );
};

export default App;
