/**
 * Check if a product's expiration date has passed (comparing date against midnight today).
 */
export function isProductExpired(expirationDate?: string | null): boolean {
  if (!expirationDate) return false;
  const expDate = new Date(expirationDate);
  if (isNaN(expDate.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDay = new Date(expDate);
  expDay.setHours(0, 0, 0, 0);

  return expDay < today;
}
