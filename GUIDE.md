# Mini Daraz: Learning Guide

## Setup
```bash
npm create vite@latest mini-daraz -- --template react
cd mini-daraz
npm install
npm install react-router-dom
npm run dev
```
(This zip already contains the finished project: just run `npm install` then `npm run dev`.)

## Build order (recommended)
1. `utils/` → 2. `services/api.js` → 3. `hooks/useFetch.js` → 4. `context/` → 5. small components (Button, Input, Loading, ErrorMessage, EmptyState) → 6. ProductCard / ProductGrid → 7. Navbar / Footer → 8. pages → 9. `App.jsx` routes + `main.jsx` providers → 10. `index.css`.

## How data flows
`Page` calls `useFetch(apiFunction)` → `services/api.js` calls DummyJSON with `fetch` → JSON returns → `useFetch` stores it in state → the page passes `products` as **props** to `ProductGrid` → `ProductCard` renders each one with `Array.map()`.
Cart/wishlist/auth are **not** passed through props. Components call `useCart()`, `useWishlist()`, `useAuth()` (wrappers around `useContext`) to read or change global state.

## File by file
| File | What / why | Key concepts |
|---|---|---|
| `main.jsx` | Entry point. Wraps `<App/>` in `BrowserRouter` and the three providers. | Context providers, routing setup |
| `App.jsx` | Layout (Navbar, Footer) and all `<Route>`s. | React Router, nested JSX |
| `utils/localStorage.js` | save/get/remove with JSON + try/catch. | localStorage, JSON.stringify/parse |
| `utils/formatPrice.js` | USD→Rs. conversion, discount math, formatting. | Pure functions |
| `services/api.js` | All `fetch` calls in one place; throws on bad responses. | async/await, fetch, error handling |
| `hooks/useFetch.js` | Reusable data loader returning `{data, loading, error, retry}`. | Custom hook, useEffect cleanup |
| `context/CartContext.jsx` | Cart state + actions + totals (`useMemo`), synced to localStorage. | useState lazy init, useEffect sync, `map/filter/find/reduce` |
| `context/WishlistContext.jsx` | Wishlist state and `isInWishlist`. | Context API |
| `context/AuthContext.jsx` | Simulated register/login/logout/updateProfile. | Context, localStorage |
| `components/ProtectedRoute.jsx` | Redirects to `/login` if not logged in. | `Navigate`, `useLocation`, children prop |
| `components/Navbar.jsx` | Links, search, counts, mobile menu. | Conditional rendering, useState (menu), NavLink |
| `components/SearchBar.jsx` | Controlled input; navigates to `/products?q=...`. | Controlled inputs, form events, `useNavigate` |
| `components/ProductCard.jsx` | One product: image, price, discount, rating, buttons. | Props, event handling, context |
| `components/ProductGrid.jsx` | Grid of cards or skeletons. | `Array.map`, `key`, conditional rendering |
| `components/CartItem.jsx`, `OrderCard.jsx`, `CategoryCard.jsx` | Small display components. | Props |
| `components/Button.jsx`, `Input.jsx` | Reusable UI with spread props (`...props`). | Props, composition |
| `components/Loading.jsx`, `ErrorMessage.jsx`, `EmptyState.jsx`, `Modal.jsx` | Shared states and dialog. | Conditional rendering |
| `pages/Home.jsx` | Hero, categories, flash sale (highest discount), popular (highest rating), recommended. | useFetch, useMemo, sort on a copy |
| `pages/Products.jsx` | Search/category in the URL, sorting, Load More. | `useSearchParams`, useMemo, useState |
| `pages/ProductDetails.jsx` | Single product, gallery, quantity, info, related items. | `useParams`, 404 handling |
| `pages/Cart.jsx`, `Wishlist.jsx` | Cart summary; move wishlist item to cart. | Context, empty states |
| `pages/Login.jsx`, `Register.jsx` | Forms with validation. | Form handling, one `handleChange` for many fields |
| `pages/Checkout.jsx` | Validated form, dummy payments, creates an order, clears cart. | Form state, localStorage |
| `pages/Orders.jsx`, `Profile.jsx` | Orders list (+ sample orders button); profile with edit modal. | filter, Modal |
| `pages/About.jsx`, `Contact.jsx` | Static page; validated contact form. | Forms |

## Concepts in plain words
- **Component**: a function returning JSX. **Props**: inputs passed from parent to child.
- **useState**: remembers a value; changing it re-renders. **useEffect**: runs code after render (fetching, syncing localStorage); the dependency array says when to re-run.
- **useMemo**: caches a calculation until its dependencies change. **useContext / Context API**: share state without passing props through every level.
- **Conditional rendering**: `cond ? <A/> : <B/>` or `cond && <A/>`.
- **Array.map** turns data into JSX; **filter** removes items; **find** gets one item; **reduce** sums.
- **Never mutate state**: copy first (`[...list]`, `{...obj}`).

## Important: simulated auth
Passwords are saved as plain text in localStorage, visible to anyone with browser access. Real apps use a backend, hashed passwords and secure tokens. `ProtectedRoute` only hides pages in the UI; it is not real security.

## Testing checklist
- [ ] Home loads categories, flash sale, popular, recommended (skeletons first)
- [ ] Click a category → filtered products
- [ ] Navbar search "phone" → "Search results for "phone""; search "zzzzz" → empty state
- [ ] Sort by price/rating/name; Load More works
- [ ] Product details: gallery, quantity, Add to Cart, Buy Now, wishlist, related products
- [ ] `/products/99999` → "Product not found"
- [ ] Cart: increase/decrease/remove/clear; totals correct; refresh keeps cart
- [ ] Wishlist: add/remove/move to cart; refresh keeps it
- [ ] Register with invalid input shows errors; duplicate email rejected
- [ ] Wrong login shows "Invalid email or password."; right login → /profile and name in navbar
- [ ] `/checkout`, `/orders`, `/profile` redirect to login when logged out
- [ ] Checkout validation; Place Order shows success + order ID; cart emptied
- [ ] Orders shows new order; "Load sample orders" shows all statuses
- [ ] Edit profile saves; Logout works
- [ ] Turn off network → "Something went wrong. Please try again." + Retry works
- [ ] Resize: 2 / 3 / 4 product columns; mobile hamburger menu
