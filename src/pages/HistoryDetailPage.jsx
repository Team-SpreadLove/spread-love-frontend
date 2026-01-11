import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";

const HistoryDetailPage = () => {
  const { id } = useParams();
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    chrome.runtime.sendMessage(
      { type: "FETCH_HISTORY_DETAIL", payload: { historyId: id } },
      (response) => {
        if (!isMounted) return;

        if (response?.success) {
          setHistory(response.data);
        }
        setIsLoading(false);
      },
    );

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <LoadingSpinner message={"상세 정보를 불러오는 중입니다..."} />
      </div>
    );
  }

  if (!history) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <p className="text-sl-gray-dark text-lg">기록을 찾을 수 없습니다</p>
        <Link to="/history" className="text-sl-blue underline">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col flex-1 gap-4 overflow-y-auto">
        <h1 className="text-[32px]">{history.contents.title}</h1>
        <p className="text-sl-gray-dark text-sm">
          요약 날짜:{" "}
          {new Date(history.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-lg">{history.contents.summary}</p>
      </div>
      <Link
        to="/history"
        className="flex justify-center items-center w-full h-10 mt-4 bg-sl-blue rounded-2xl text-base text-sl-white"
      >
        목록으로
      </Link>
    </div>
  );
};

export default HistoryDetailPage;
