// Billing Service - Serviço de faturamento

import { httpClient, type ApiResponse } from "../http-client"
import { API_CONFIG } from "../config"
import type { Transaction } from "@/lib/types"

export interface BillingSummary {
  totalRevenue: number
  monthlyRevenue: number
  pendingAmount: number
  totalTransactions: number
}

export interface TransactionFilters {
  type?: string
  status?: string
  start?: string
  end?: string
  page?: number
  pageSize?: number
}

export interface PaginatedTransactions {
  data: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Invoice {
  companyId: string
  companyName: string
  totalAmount: number
  transactions: Transaction[]
}

export const billingService = {
  // Resumo de faturamento
  async getSummary(): Promise<ApiResponse<BillingSummary>> {
    return httpClient.get(API_CONFIG.ENDPOINTS.BILLING.SUMMARY)
  },

  // Listar transações
  async getTransactions(filters?: TransactionFilters): Promise<ApiResponse<PaginatedTransactions>> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value))
      })
    }
    return httpClient.get(`${API_CONFIG.ENDPOINTS.BILLING.TRANSACTIONS}?${params.toString()}`)
  },

  // Listar faturas
  async getInvoices(): Promise<ApiResponse<Invoice[]>> {
    return httpClient.get(API_CONFIG.ENDPOINTS.BILLING.INVOICES)
  },

  // Criar transação (admin)
  async createTransaction(data: Omit<Transaction, "id">): Promise<ApiResponse<Transaction>> {
    return httpClient.post(API_CONFIG.ENDPOINTS.BILLING.TRANSACTIONS, data)
  },
}
