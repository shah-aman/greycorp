export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'interest';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // Keep as ISO string or timestamp number for simplicity
  fundName?: string; // Optional: name of the fund involved, e.g., for investment/withdrawal
  description?: string; // Optional: More details
} 