// Small wrappers so the rest of the app never touches JSON.parse directly.
export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Could not save to localStorage", error);
  }
};

export const getFromLocalStorage = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const removeFromLocalStorage = (key) => localStorage.removeItem(key);
