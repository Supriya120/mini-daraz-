import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSent(true); // no backend: we just show a confirmation
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="auth-box card">
      <h1>Contact Us</h1>
      {sent && <p className="form-success" role="status">Thanks! Your message was received (demo only).</p>}
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <Input label="Message" name="message" as="textarea" rows="4" value={form.message} onChange={handleChange} error={errors.message} />
        <Button type="submit" className="block">Send Message</Button>
      </form>
    </div>
  );
}
