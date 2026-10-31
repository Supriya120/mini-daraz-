import { createContext, useContext, useState, useEffect } from "react";
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from "../utils/localStorage.js";

const AuthContext = createContext(null);

/*
  SIMULATED AUTH — for learning only.
  Users and passwords are saved in plain text in localStorage, which anyone can read.
  Real apps: a backend verifies credentials, stores hashed passwords, and returns a
  secure token (e.g. an httpOnly cookie). Never do this in production.
*/
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getFromLocalStorage("user", null));

  useEffect(() => {
    if (currentUser) saveToLocalStorage("user", currentUser);
    else removeFromLocalStorage("user");
  }, [currentUser]);

  // Each function returns { ok, message } so forms can show the result.
  const register = ({ name, email, password }) => {
    const users = getFromLocalStorage("users", []);
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === cleanEmail)) {
      return { ok: false, message: "An account with this email already exists." };
    }
    saveToLocalStorage("users", [...users, { name: name.trim(), email: cleanEmail, password, phone: "", address: "" }]);
    return { ok: true };
  };

  const login = (email, password) => {
    const users = getFromLocalStorage("users", []);
    const found = users.find((u) => u.email === email.trim().toLowerCase() && u.password === password);
    if (!found) return { ok: false, message: "Invalid email or password." };
    const { password: _password, ...safeUser } = found; // never keep the password in state
    setCurrentUser(safeUser);
    return { ok: true };
  };

  const logout = () => setCurrentUser(null);

  const updateProfile = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    const users = getFromLocalStorage("users", []);
    saveToLocalStorage("users", users.map((u) => (u.email === updated.email ? { ...u, ...updates } : u)));
  };

  const value = { currentUser, login, logout, register, updateProfile, isAuthenticated: Boolean(currentUser) };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
