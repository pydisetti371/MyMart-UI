import { billingCopy } from "./constants";

const rupees = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const mobileNumberPattern = /^\d{10}$/;

export function formatAmount(amount: number) {
  return rupees.format(amount);
}

export function formatRupees(amount: number) {
  return `${billingCopy.currencySymbol} ${formatAmount(amount)}`;
}
