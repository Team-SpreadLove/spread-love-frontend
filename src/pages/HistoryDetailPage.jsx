import { useLocation, Link } from "react-router";

const HistoryDetailPage = () => {
  const location = useLocation();
  const { history } = location.state || {};

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
