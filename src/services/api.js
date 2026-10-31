const BASE_URL = "https://dummyjson.com";

// One helper handles fetch + error checking for every endpoint.
async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    const error = new Error(response.status === 404 ? "Not found" : "Request failed");
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export const getProducts = (limit = 0, skip = 0) => request(`/products?limit=${limit}&skip=${skip}`);
export const getProductById = (id) => request(`/products/${id}`);
export const getCategories = () => request("/products/categories");
export const getProductsByCategory = (category) => request(`/products/category/${encodeURIComponent(category)}`);
export const searchProducts = (query) => request(`/products/search?q=${encodeURIComponent(query)}`);
// Demo only: the real cart lives in React state + localStorage.
export const getSampleCart = () => request("/carts/1");
