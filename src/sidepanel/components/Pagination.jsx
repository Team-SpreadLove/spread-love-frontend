import { PAGINATION } from "../../shared/constants/index.js";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const currentGroup = Math.ceil(currentPage / PAGINATION.GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGINATION.GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGINATION.GROUP_SIZE - 1, totalPages);

  const handlePrevGroup = () => onPageChange(startPage - 1);
  const handleNextGroup = () => onPageChange(endPage + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {startPage > 1 && (
        <button
          type="button"
          onClick={handlePrevGroup}
          aria-label="이전 페이지 목록"
          className="px-2 py-1 text-sl-blue cursor-pointer"
        >
          &lt;
        </button>
      )}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`px-2 py-1 cursor-pointer ${
            currentPage === page ? "font-bold text-sl-blue" : "text-sl-gray-dark"
          }`}
        >
          {page}
        </button>
      ))}
      {endPage < totalPages && (
        <button
          type="button"
          onClick={handleNextGroup}
          aria-label="다음 페이지 목록"
          className="px-2 py-1 text-sl-blue cursor-pointer"
        >
          &gt;
        </button>
      )}
    </div>
  );
};

export default Pagination;
