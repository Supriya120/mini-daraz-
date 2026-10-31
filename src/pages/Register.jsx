import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = register(form);
    if (!result.ok) return setMessage(result.message);
    navigate("/login");
  };

  return (
    <div className="auth-box card">
      <h1>Create Account</h1>
      {message && <p className="form-error" role="alert">{message}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <Button type="submit" className="block">Register</Button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
