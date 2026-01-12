import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SUMMARY_STATUS } from "./constants/index.js";

const App = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [summaryStatus, setSummaryStatus] = useState(SUMMARY_STATUS.DEFAULT);

  const handleLogoClick = () => {
    setSummaryStatus(SUMMARY_STATUS.DEFAULT);
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

  return (
    <div className="flex flex-col h-screen gap-5 p-5">
      <Header
        isLoggedIn={isLoggedIn}
        summaryStatus={summaryStatus}
        currentPath={location.pathname}
        onLogoClick={handleLogoClick}
      />
      <main className="flex flex-col items-center gap-2 w-full h-full p-3 border border-sl-blue rounded-xl overflow-y-auto">
        <Outlet context={{ summaryStatus, setSummaryStatus }} />
      </main>
      <Footer
        isLoggedIn={isLoggedIn}
        currentPath={location.pathname}
        summaryStatus={summaryStatus}
      />
    </div>
  );
};

export default App;
