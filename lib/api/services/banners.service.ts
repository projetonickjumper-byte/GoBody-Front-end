// Banners Service - Serviço de banners

import { httpClient, type ApiResponse } from "../http-client"
import type { Banner } from "@/lib/types"

export const bannersService = {
  // Listar banners
  async getAll(): Promise<ApiResponse<Banner[]>> {
    return httpClient.get("/banners")
  },

  // Criar banner (admin)
  async create(data: Omit<Banner, "id">): Promise<ApiResponse<Banner>> {
    return httpClient.post("/banners", data)
  },

  // Atualizar banner (admin)
  async update(id: string, data: Partial<Banner>): Promise<ApiResponse<Banner>> {
    return httpClient.put(`/banners/${id}`, data)
  },

  // Excluir banner (admin)
  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(`/banners/${id}`)
  },
}
