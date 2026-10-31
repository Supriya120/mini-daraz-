import Button from "./Button.jsx";

export default function ErrorMessage({ onRetry }) {
  return (
    <div className="empty" role="alert">
      <h3>Something went wrong.</h3>
      <p>Please try again.</p>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
}
