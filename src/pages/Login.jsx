import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // One handler for every input: the input's `name` tells us which field changed.
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email address.";
    if (!form.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = login(form.email, form.password);
    if (!result.ok) return setMessage(result.message);
    navigate(location.state?.from?.pathname || "/profile", { replace: true });
  };

  return (
    <div className="auth-box card">
      <h1>Login</h1>
      {message && <p className="form-error" role="alert">{message}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        <Button type="submit" className="block">Login</Button>
      </form>
      <p>New here? <Link to="/register">Create an account</Link></p>
      <small className="muted">Practice project: accounts are stored in your browser only.</small>
    </div>
  );
}
