const ErrorMessage = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <p role="alert" tabIndex={0} className={`text-sl-red text-lg ${className}`}>
      {message}
    </p>
  );
};

export default ErrorMessage;
