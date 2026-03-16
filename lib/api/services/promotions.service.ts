// Promotions Service - Serviço de promoções

import { httpClient, type ApiResponse } from "../http-client"
import type { Promotion } from "@/lib/types"

export const promotionsService = {
  // Listar todas as promoções
  async getAll(): Promise<ApiResponse<Promotion[]>> {
    return httpClient.get("/promotions")
  },

  // Listar promoções de uma academia
  async getByGym(gymId: string): Promise<ApiResponse<Promotion[]>> {
    return httpClient.get(`/promotions/gym/${gymId}`)
  },

  // Criar promoção (parceiro/admin)
  async create(data: Omit<Promotion, "id">): Promise<ApiResponse<Promotion>> {
    return httpClient.post("/promotions", data)
  },

  // Atualizar promoção
  async update(id: string, data: Partial<Promotion>): Promise<ApiResponse<Promotion>> {
    return httpClient.put(`/promotions/${id}`, data)
  },

  // Excluir promoção
  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(`/promotions/${id}`)
  },
}
