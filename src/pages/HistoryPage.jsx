import { useState, useEffect } from "react";

const HistoryPage = () => {
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    let isMounted = true;

    chrome.runtime.sendMessage({ type: "FETCH_HISTORIES" }, (response) => {
      if (isMounted && response?.success) {
        setHistories(response.data.histories);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

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
