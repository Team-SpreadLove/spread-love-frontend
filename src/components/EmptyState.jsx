const EmptyState = ({ message }) => {
  return (
    <div className="flex justify-center items-center w-full h-full" role="status">
      <p className="text-sl-gray-dark text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
