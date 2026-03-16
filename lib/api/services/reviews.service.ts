// Reviews Service - Serviço completo de avaliações de academias

import { httpClient, type ApiResponse } from "../http-client"
import { API_CONFIG } from "../config"
import type { Review } from "@/lib/types"

export interface CreateReviewData {
  gymId: string
  rating: number
  text: string
  images?: string[]
  modality?: string
}

export const reviewsService = {
  // Listar todas as avaliações
  async getAll(page?: number, pageSize?: number): Promise<ApiResponse<Review[]>> {
    const params = new URLSearchParams()
    if (page) params.append("page", String(page))
    if (pageSize) params.append("pageSize", String(pageSize))
    return httpClient.get(`${API_CONFIG.ENDPOINTS.REVIEWS.LIST}?${params.toString()}`)
  },

  // Obter avaliação por ID
  async getById(id: string): Promise<ApiResponse<Review>> {
    return httpClient.get(API_CONFIG.ENDPOINTS.REVIEWS.GET(id))
  },

  // Avaliações de uma academia
  async getByGym(gymId: string): Promise<ApiResponse<Review[]>> {
    return httpClient.get(API_CONFIG.ENDPOINTS.REVIEWS.BY_GYM(gymId))
  },

  // Criar avaliação
  async create(data: CreateReviewData): Promise<ApiResponse<Review>> {
    return httpClient.post(API_CONFIG.ENDPOINTS.REVIEWS.CREATE, data)
  },

  // Atualizar avaliação
  async update(id: string, data: Partial<CreateReviewData>): Promise<ApiResponse<Review>> {
    return httpClient.put(API_CONFIG.ENDPOINTS.REVIEWS.UPDATE(id), data)
  },

  // Excluir avaliação
  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(API_CONFIG.ENDPOINTS.REVIEWS.DELETE(id))
  },

  // Responder avaliação (parceiro)
  async respond(id: string, text: string): Promise<ApiResponse<Review>> {
    return httpClient.post(`/reviews/${id}/response`, { text })
  },

  // Marcar como útil
  async markHelpful(id: string): Promise<ApiResponse<{ helpful: number }>> {
    return httpClient.post(`/reviews/${id}/helpful`, {})
  },
}
