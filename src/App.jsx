import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, matchPath } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DeleteModal from "./components/DeleteModal";
import { SUMMARY_STATUS, IMAGE_ANALYSIS_STATUS } from "./constants/index.js";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [summaryStatus, setSummaryStatus] = useState(SUMMARY_STATUS.DEFAULT);
  const [summaryData, setSummaryData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(IMAGE_ANALYSIS_STATUS.LOADING);
  const [analysisData, setAnalysisData] = useState(null);

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

    if (location.pathname === "/analysis") {
      return analysisData?.data?.historyId;
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

    if (location.pathname === "/analysis") {
      setAnalysisStatus(IMAGE_ANALYSIS_STATUS.LOADING);
      setAnalysisData(null);
      navigate("/");
    }
  };

  const handleLogoClick = () => {
    setSummaryStatus(SUMMARY_STATUS.DEFAULT);
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
    const tempToken = import.meta.env.VITE_TEMP_AUTH_TOKEN;

    let isMounted = true;

    // TODO: 로그인 연동 후 삭제
    if (isMounted && tempToken) {
      chrome.storage.local.set({ token: tempToken });
    }

    chrome.storage.local.get("token", (result) => {
      if (isMounted) {
        setIsLoggedIn(!!result.token);
      }
    });

    return () => {
      isMounted = false;
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
      <Header
        isLoggedIn={isLoggedIn}
        summaryStatus={summaryStatus}
        currentPath={location.pathname}
        onLogoClick={handleLogoClick}
      />
      <main className="flex flex-col items-center gap-2 w-full h-full p-3 border border-sl-blue rounded-xl overflow-y-auto">
        <Outlet
          context={{
            summaryStatus,
            setSummaryStatus,
            summaryData,
            setSummaryData,
            analysisStatus,
            setAnalysisStatus,
            analysisData,
            setAnalysisData,
          }}
        />
      </main>
      <Footer
        isLoggedIn={isLoggedIn}
        currentPath={location.pathname}
        summaryStatus={summaryStatus}
        analysisStatus={analysisStatus}
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
