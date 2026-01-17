import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import { supabase } from "../api/supabase";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!isMounted) return;

        if (session) {
          chrome.storage.local.set({ userToken: session.access_token }, () => {
            chrome.tabs.getCurrent((tab) => {
              if (tab && tab.id) chrome.tabs.remove(tab.id);
            });
          });
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: chrome.runtime.getURL("src/tabs/login.html"),
      },
    });

    if (error) {
      console.error("로그인 에러:", error);
      setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sl-white">
      <div className="mb-8">
        <Logo iconSize={128} textSize={64} spacing="ml-2" useRouter={false} />
      </div>
      <button
        type="button"
        aria-label="Google 계정으로 로그인"
        onClick={handleGoogleLogin}
        className="cursor-pointer"
        disabled={isLoading}
      >
        <img src="/images/icons/google-signin.svg" alt="" aria-hidden="true" className="h-12" />
      </button>
      {errorMessage && (
        <p role="alert" className="mt-4 text-sl-red text-lg">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Login;
