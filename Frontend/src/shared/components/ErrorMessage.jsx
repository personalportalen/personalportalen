const ErrorMessage = ({
  title = 'Något gick fel',
  message = 'Försök igen senare.',
}) => {
  return (
    <div className="error-message">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
