import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DeleteModal from "./components/DeleteModal";
import useAuthStore from "./stores/useAuthStore";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    chrome.storage.local.get("userToken", (result) => {
      if (isMounted) {
        setIsLoggedIn(Boolean(result.userToken));
      }
    });

    const handleStorageChange = (changes) => {
      if (changes.userToken && isMounted) {
        setIsLoggedIn(Boolean(changes.userToken.newValue));
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
