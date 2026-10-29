/**
 * Indian Rupee (INR) Currency Formatter
 * Formats numbers into standard Indian numbering system (e.g. ₹1,499, ₹12,999, ₹89,999)
 */
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num);
};

// High-resolution fallback placeholder if an external image fails to load
export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
