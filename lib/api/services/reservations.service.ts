// Reservations Service - Serviço de reservas

import { httpClient, type ApiResponse } from "../http-client"
import { API_CONFIG } from "../config"
import type { Reservation } from "@/lib/types"

export interface CreateReservationData {
  gymId: string
  date: string
  time: string
  type: "class" | "personal" | "day_use"
  className?: string
  instructorName?: string
  cancellationDeadline?: string
}

export const reservationsService = {
  // Listar reservas do usuário autenticado
  async getAll(status?: string): Promise<ApiResponse<Reservation[]>> {
    const params = status ? `?status=${status}` : ""
    return httpClient.get(`${API_CONFIG.ENDPOINTS.RESERVATIONS.LIST}${params}`)
  },

  // Obter reserva por ID
  async getById(id: string): Promise<ApiResponse<Reservation>> {
    return httpClient.get(API_CONFIG.ENDPOINTS.RESERVATIONS.GET(id))
  },

  // Reservas de um usuário específico
  async getByUser(userId: string): Promise<ApiResponse<Reservation[]>> {
    return httpClient.get(API_CONFIG.ENDPOINTS.RESERVATIONS.BY_USER(userId))
  },

  // Criar reserva
  async create(data: CreateReservationData): Promise<ApiResponse<Reservation>> {
    return httpClient.post(API_CONFIG.ENDPOINTS.RESERVATIONS.CREATE, data)
  },

  // Cancelar reserva
  async cancel(id: string): Promise<ApiResponse<Reservation>> {
    return httpClient.patch(API_CONFIG.ENDPOINTS.RESERVATIONS.CANCEL(id), {})
  },

  // Confirmar reserva (parceiro)
  async confirm(id: string): Promise<ApiResponse<Reservation>> {
    return httpClient.patch(`/reservations/${id}/confirm`, {})
  },

  // Completar reserva (parceiro)
  async complete(id: string): Promise<ApiResponse<Reservation>> {
    return httpClient.patch(`/reservations/${id}/complete`, {})
  },
}
