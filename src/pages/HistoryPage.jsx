import { useState, useEffect } from "react";
import { Link } from "react-router";
import NoData from "../components/NoData";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import { PAGINATION } from "../constants/index.js";

const HistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    chrome.runtime.sendMessage(
      { type: "FETCH_HISTORIES", payload: { page: currentPage, limit: PAGINATION.PAGE_SIZE } },
      (response) => {
        if (!isMounted) return;

        if (response?.success) {
          setHistories(response.data.histories);
          setTotalPages(response.data.pagination?.totalPages || 1);
        }

        setIsLoading(false);
      },
    );

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page === currentPage) return;

    setIsLoading(true);
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <LoadingSpinner message={"전체 목록을 불러오는 중입니다..."} />
      </div>
    );
  }

  if (histories.length === 0) {
    return <NoData message={"기록이 없습니다"} />;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <ul className="flex flex-col w-full gap-3 flex-1">
        {histories.map((history) => (
          <li key={history.id}>
            <Link
              to={`/history/${history.id}`}
              state={{ history }}
              className="block w-full h-10 px-4 bg-sl-blue rounded-2xl text-base text-sl-white truncate leading-10 text-center"
            >
              {new Date(history.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              - {history.contents.title}
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default HistoryPage;
