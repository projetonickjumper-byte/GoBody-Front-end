// Users Service - Serviço de perfil e gerenciamento de usuários

import { httpClient, type ApiResponse } from "../http-client"
import { API_CONFIG } from "../config"
import type { User } from "@/lib/types"

export interface UpdateProfileData {
  name?: string
  phone?: string
  bio?: string
  birthDate?: string
  gender?: string
  fitnessGoals?: string[]
  avatar?: string
  businessName?: string
  businessType?: string
  address?: string
  city?: string
  state?: string
}

export const usersService = {
  // Obter perfil do usuário autenticado
  async getProfile(): Promise<ApiResponse<User>> {
    return httpClient.get(API_CONFIG.ENDPOINTS.USERS.PROFILE)
  },

  // Atualizar perfil
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    return httpClient.put(API_CONFIG.ENDPOINTS.USERS.PROFILE, data)
  },

  // Obter usuário por ID
  async getById(id: string): Promise<ApiResponse<User>> {
    return httpClient.get(API_CONFIG.ENDPOINTS.USERS.GET(id))
  },

  // Listar usuários (admin)
  async getAll(filters?: {
    search?: string
    type?: string
    page?: number
    pageSize?: number
  }): Promise<ApiResponse<{ data: User[]; total: number; page: number; pageSize: number; totalPages: number }>> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value))
      })
    }
    return httpClient.get(`${API_CONFIG.ENDPOINTS.USERS.LIST}?${params.toString()}`)
  },

  // Atualizar usuário (admin)
  async update(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return httpClient.put(API_CONFIG.ENDPOINTS.USERS.UPDATE(id), data)
  },

  // Excluir usuário (admin)
  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(API_CONFIG.ENDPOINTS.USERS.DELETE(id))
  },
}
