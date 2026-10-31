// DummyJSON prices are in USD. We convert to Nepalese Rupees for display.
export const USD_TO_NPR = 133;

export const toNpr = (usd) => Math.round(usd * USD_TO_NPR);
export const formatNpr = (npr) => `Rs. ${Math.round(npr).toLocaleString("en-IN")}`;
export const formatPrice = (usd) => formatNpr(toNpr(usd));

// Price after applying the product's discount percentage.
export const discountedUsd = (price, discountPercentage = 0) =>
  price * (1 - discountPercentage / 100);
