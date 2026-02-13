const NoData = ({ message }) => {
  return (
    <div className="flex justify-center items-center w-full h-full" role="status">
      <p tabIndex={0} className="text-sl-gray-dark text-lg">
        {message}
      </p>
    </div>
  );
};

export default NoData;
