export type Category = 'BILLS' | 'ENTERTAINMENT' | 'FOOD' | 'SHOPPING' | 'TRANSPORTATION' | 'USER';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface UserRequestDTO {
  fullName: string;
  email: string;
  password?: string;
}

export interface LoginRequestDTO {
  email: string;
  password?: string;
}

export interface JwtResponse {
  token: string;
}

export interface FriendResponseDTO {
  fullName: string;
  email: string;
  iban: string;
}

export interface CardResponseDTO {
  id: string;
  cardNumberMasked: string;
  cardNumber: string;
  expirationDate: {
    year: number;
    month: string;
    monthValue: number;
  };
  cvvNumber: string;
}

export interface TransactionDTO {
  type: TransactionType;
  amount: number;
  description: string;
  ibanSender: string;
  ibanReceiver: string;
  date: string;
  fromOrTo: string;
}

export interface HistorySummaryDTO {
  totalIncomes: number;
  totalExpenses: number;
  lastTransactions: TransactionDTO[];
}

export interface AccountResponseDTO {
  iban: string;
  balance: number;
  category: Category;
  card?: CardResponseDTO;
  history?: HistorySummaryDTO;
}

export interface UserResponseDTO {
  fullName: string;
  email: string;
  account?: AccountResponseDTO;
}

export interface FirmDTO {
  fullName: string;
  email: string;
  category: Category;
  iban: string;
}

export interface ExpenseRequestDTO {
  description: string;
  amount: number;
  ibanReceiver: string;
  pin?: string;
}

export interface TopupRequestDTO {
  amount: number;
  description?: string;
}

export interface LowBalanceAlertDTO {
  shouldAlert: boolean;
  message?: string;
  balance?: number;
}

export interface SummaryDTO {
  incomes: number;
  expense: number;
  netSavings: number;
}

export interface WeeklyBarDTO {
  day: string;
  total: number;
}

export interface CategorySpendingDTO {
  category: Category;
  total: number;
}

export interface DashboardStatsDTO {
  monthSummary: SummaryDTO;
  weekSummary: SummaryDTO;
  weeklySpending: WeeklyBarDTO[];
  spendingByCategory: CategorySpendingDTO[];
}

export interface UpdateSettingsReqDTO {
  lowBalanceEnabled?: boolean;
  lowBalanceThreshold?: number;
  newPin?: string;
}

export interface SettingsRespDTO {
  lowBalanceEnabled: boolean;
  lowBalanceThreshold: number;
  hasPinSet: boolean;
}

export interface FeedbackRequestDTO {
  experience: string;
  recommend: boolean;
  likedFeatures: string[];
  comments: string;
}
