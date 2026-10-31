// Label + input + error message in one reusable piece.
export default function Input({ label, name, error, as = "input", children, ...props }) {
  const Tag = as; // "input", "select" or "textarea"
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Tag id={name} name={name} className={error ? "invalid" : ""} {...props}>
        {children}
      </Tag>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
