const ErrorMessage = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <p role="alert" className={`text-sl-red text-lg ${className}`}>
      {message}
    </p>
  );
};

export default ErrorMessage;
