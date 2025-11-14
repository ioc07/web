export interface Loan {
  id: string;
  bank: string;
  amount: number;
  rate: number;
  disbursementDate: string;
  maturityDate: string;
  term: number;
  status: "Active" | "Paid" | "Overdue";
  notes: string;
}

export interface Settings {
  paymentDay: number;
  yearBasis: number;
}

export interface LoanStatistics {
  totalLoans: number;
  activeLoans: number;
  totalAmount: number;
  averageRate: number;
  totalInterest: number;
  monthlyInterest: number;
}

export interface BankSummary {
  bank: string;
  count: number;
  totalAmount: number;
  avgRate: number;
  monthlyInterest: number;
  totalInterest: number;
}

export type TabType = "all" | "active" | "paid" | "overdue" | "summary";
