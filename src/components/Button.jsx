// Reusable button. `variant` picks the style: primary | outline | danger | ghost
export default function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
