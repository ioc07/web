import { Loan } from "./types";

export function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(2) + "B";
  } else if (amount >= 1000000) {
    return (amount / 1000000).toFixed(0) + "M";
  }
  return amount.toLocaleString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculateMonthlyInterest(
  amount: number,
  rate: number,
  yearBasis: number = 365
): number {
  return (amount * (rate / 100) * 30) / yearBasis;
}

export function calculateTotalInterest(
  amount: number,
  rate: number,
  term: number,
  yearBasis: number = 365
): number {
  const monthly = calculateMonthlyInterest(amount, rate, yearBasis);
  const firstPeriodDays = 5; // Simplified for demo
  const firstInterest = (amount * (rate / 100) * firstPeriodDays) / yearBasis;
  return firstInterest + (term - 1) * monthly;
}

export function calculateTerm(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return months;
}

export function getBankBadgeClass(bank: string): string {
  const bankMap: Record<string, string> = {
    "Bank A": "bank-a",
    "Bank B": "bank-b",
    "Bank C": "bank-c",
    "Bank D": "bank-d",
    "Bank E": "bank-e",
  };
  return bankMap[bank] || "bank-a";
}

export function getStatusBadgeVariant(
  status: string
): "success" | "info" | "destructive" {
  const statusMap: Record<string, "success" | "info" | "destructive"> = {
    Active: "success",
    Paid: "info",
    Overdue: "destructive",
  };
  return statusMap[status] || "success";
}
