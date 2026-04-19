import { apiFetch } from './client';
import type {
  UserRequestDTO,
  LoginRequestDTO,
  JwtResponse,
  UserResponseDTO,
  FriendResponseDTO,
  FirmDTO,
  DashboardStatsDTO,
  HistorySummaryDTO,
  ExpenseRequestDTO,
  TopupRequestDTO,
  LowBalanceAlertDTO,
  SettingsRespDTO,
  UpdateSettingsReqDTO,
  TransactionDTO,
  FeedbackRequestDTO
} from '../types';

export const authService = {
  login: (data: LoginRequestDTO) => apiFetch<JwtResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: UserRequestDTO) => apiFetch<any>('/auth', { method: 'POST', body: JSON.stringify(data) }),
  signout: () => apiFetch<any>('/auth/signout', { method: 'POST' }),
};

export const userService = {
  getProfile: () => apiFetch<UserResponseDTO>('/user'),
  getMyUserAccount: () => apiFetch<UserResponseDTO>('/user'),
  deleteAccount: () => apiFetch<void>('/user', { method: 'DELETE' }),
};

export const financeService = {
  getStats: (offset?: number) => {
    const url = offset !== undefined ? `/stats?offset=${offset}` : '/stats';
    return apiFetch<DashboardStatsDTO>(url);
  },
  getHistory: () => apiFetch<HistorySummaryDTO>('/history'),
  getRecentUserTransactions: () => apiFetch<TransactionDTO[]>('/history/recent/users'),
  getRecentFirmPayments: () => apiFetch<TransactionDTO[]>('/history/recent/firms'),
  createExpense: (data: ExpenseRequestDTO) => apiFetch<any>('/expense', { method: 'POST', body: JSON.stringify(data) }),
  topup: (data: TopupRequestDTO) => apiFetch<void>('/card/topup', { method: 'POST', body: JSON.stringify(data) }),
  submitFeedback: (data: FeedbackRequestDTO) => apiFetch<any>('/feedback', { method: 'POST', body: JSON.stringify(data) }),
};

export const friendService = {
  getFriends: () => apiFetch<FriendResponseDTO[]>('/friends'),
  searchFriends: (query: string) => apiFetch<FriendResponseDTO[]>('/friends/search', {
    method: 'POST',
    body: JSON.stringify({ nameOrMail: query })
  }),
  addFriend: (iban: string) => apiFetch<FriendResponseDTO>('/friends/add', {
    method: 'POST',
    body: JSON.stringify({ iban })
  }),
};

export const firmService = {
  listFirms: (category?: string) => apiFetch<FirmDTO[]>('/firms', {
    method: 'POST',
    body: JSON.stringify({ category })
  }),
  upgradeToFirm: (category: string) => apiFetch<void>('/firms/upgrade', {
    method: 'POST',
    body: JSON.stringify({ category })
  }),
};

export const alertService = {
  checkLowBalance: () => apiFetch<LowBalanceAlertDTO>('/alerts/low-balance'),
  getSettings: () => apiFetch<SettingsRespDTO>('/settings'),
  updateSettings: (data: UpdateSettingsReqDTO) => apiFetch<SettingsRespDTO>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
};
