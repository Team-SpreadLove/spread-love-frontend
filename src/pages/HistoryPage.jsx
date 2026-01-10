import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const HistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    chrome.runtime.sendMessage({ type: "FETCH_HISTORIES" }, (response) => {
      if (isMounted) {
        if (response?.success) {
          setHistories(response.data.histories);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <LoadingSpinner message={"히스토리를 불러오는 중입니다..."} />
      </div>
    );
  }

  return (
    <ul className="flex flex-col w-full gap-3">
      {histories.map((history) => (
        <li
          key={history.id}
          className="flex justify-center items-center w-full h-10 bg-sl-blue rounded-2xl text-base text-sl-white"
        >
          {new Date(history.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          - {history.contents.title}
        </li>
      ))}
    </ul>
  );
};

export default HistoryPage;
