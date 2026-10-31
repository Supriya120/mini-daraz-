import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Modal from "../components/Modal.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

export default function Profile() {
  const { currentUser, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: currentUser.name, phone: currentUser.phone || "", address: currentUser.address || "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError("Name is required.");
    if (form.phone && !/^\d{10}$/.test(form.phone)) return setError("Phone must be 10 digits.");
    updateProfile(form);
    setError("");
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="card profile">
      <h1>My Profile</h1>
      <dl>
        <dt>Name</dt><dd>{currentUser.name}</dd>
        <dt>Email</dt><dd>{currentUser.email}</dd>
        <dt>Phone</dt><dd>{currentUser.phone || "Not added"}</dd>
        <dt>Address</dt><dd>{currentUser.address || "Not added"}</dd>
      </dl>
      <div className="detail-actions">
        <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      {editing && (
        <Modal title="Edit Profile" onClose={() => setEditing(false)}>
          <form onSubmit={handleSave} noValidate>
            {error && <p className="form-error">{error}</p>}
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} />
            <Button type="submit" className="block">Save Changes</Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
