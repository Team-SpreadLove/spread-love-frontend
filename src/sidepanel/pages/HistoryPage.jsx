import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import NoData from "../../shared/components/NoData";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorMessage from "../../shared/components/ErrorMessage";
import Pagination from "../components/Pagination";
import { PAGINATION } from "../../shared/constants/index.js";
import { formatDate } from "../../shared/utils/formatDate";

const HistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchError, setFetchError] = useState(null);

  const firstItemRef = useCallback((node) => {
    if (node) node.focus();
  }, []);

  useEffect(() => {
    let isMounted = true;

    chrome.runtime.sendMessage(
      { type: "FETCH_HISTORIES", payload: { page: currentPage, limit: PAGINATION.PAGE_SIZE } },
      (response) => {
        if (!isMounted) return;

        if (response?.success) {
          setHistories(response.data.histories);
          setTotalPages(response.data.pagination?.totalPages || 1);
          setFetchError(null);
        } else {
          setFetchError(response?.error || "기록을 불러오는데 실패했습니다.");
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

  if (fetchError) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <ErrorMessage message={fetchError} />
      </div>
    );
  }

  if (histories.length === 0) {
    return <NoData message={"기록이 없습니다"} />;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <ul className="flex flex-col w-full gap-3 flex-1">
        {histories.map((history, index) => (
          <li key={history.id}>
            <Link
              ref={index === 0 ? firstItemRef : undefined}
              to={`/history/${history.id}`}
              state={{ history }}
              className="block w-full h-10 px-4 bg-sl-blue rounded-2xl text-base text-sl-white truncate leading-10 text-center"
            >
              {formatDate(history.createdAt)} - {history.contents.title}
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
