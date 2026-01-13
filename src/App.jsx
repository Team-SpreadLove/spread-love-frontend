import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, matchPath } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DeleteModal from "./components/DeleteModal";
import { SUMMARY_STATUS } from "./constants/index.js";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [summaryStatus, setSummaryStatus] = useState(SUMMARY_STATUS.DEFAULT);
  const [summaryData, setSummaryData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const getHistoryId = () => {
    if (location.pathname === "/") {
      return summaryData.historyId;
    }

    if (location.pathname.startsWith("/history/")) {
      const match = matchPath("/history/:id", location.pathname);
      return match.params.id;
    }

    return null;
  };

  const afterDeleteAction = () => {
    setIsModalOpen(false);

    if (location.pathname === "/") {
      setSummaryStatus(SUMMARY_STATUS.DEFAULT);
      setSummaryData(null);
    }

    if (location.pathname.startsWith("/history/")) {
      navigate("/history");
    }
  };

  const handleLogoClick = () => {
    setSummaryStatus(SUMMARY_STATUS.DEFAULT);
  };

  const handleLoginButtonClick = () => {
    const loginUrl = chrome.runtime.getURL("src/tabs/login.html");
    chrome.tabs.create({ url: loginUrl });
  };

  const handleFooterDeleteButton = () => {
    setIsModalOpen(true);
  };

  const handleModalCancelButton = () => {
    setIsModalOpen(false);
  };

  const handleModalDeleteButton = () => {
    const historyId = getHistoryId();
    chrome.runtime.sendMessage(
      {
        type: "DELETE_HISTORY",
        payload: { historyId },
      },
      (response) => {
        if (!response.success) return;

        afterDeleteAction();
      },
    );
  };

  useEffect(() => {
    let isMounted = true;

    chrome.storage.local.get("token", (result) => {
      if (isMounted) {
        setIsLoggedIn(!!result.token);
      }
    });

    const handleStorageChange = (changes) => {
      if (changes.token && isMounted) {
        setIsLoggedIn(!!changes.token.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen gap-5 p-5">
      <Header
        isLoggedIn={isLoggedIn}
        summaryStatus={summaryStatus}
        currentPath={location.pathname}
        onLogoClick={handleLogoClick}
        onLoginClick={handleLoginButtonClick}
      />
      <main className="flex flex-col items-center gap-2 w-full h-full p-3 border border-sl-blue rounded-xl overflow-y-auto">
        <Outlet context={{ summaryStatus, setSummaryStatus, summaryData, setSummaryData }} />
      </main>
      <Footer
        isLoggedIn={isLoggedIn}
        currentPath={location.pathname}
        summaryStatus={summaryStatus}
        onDeleteClick={handleFooterDeleteButton}
      />
      <DeleteModal
        isOpen={isModalOpen}
        onCancel={handleModalCancelButton}
        onDelete={handleModalDeleteButton}
      />
    </div>
  );
};

export default App;
