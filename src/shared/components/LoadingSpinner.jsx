const LoadingSpinner = ({ message }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src="/images/icons/spreadlove-loading-48.svg"
        alt="로딩 이미지"
        aria-hidden="true"
        className="animate-spin"
      />
      <p className="text-[16px]">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
