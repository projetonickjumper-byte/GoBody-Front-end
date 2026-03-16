// Favorites Service - Serviço de favoritos

import { httpClient, type ApiResponse } from "../http-client"
import type { Gym } from "@/lib/types"

export interface FavoriteGym extends Gym {
  favoritedAt: string
}

export const favoritesService = {
  // Listar favoritos do usuário
  async getAll(): Promise<ApiResponse<FavoriteGym[]>> {
    return httpClient.get("/favorites")
  },

  // Adicionar favorito
  async add(gymId: string): Promise<ApiResponse<{ id: string; userId: string; gymId: string }>> {
    return httpClient.post("/favorites", { gymId })
  },

  // Remover favorito
  async remove(gymId: string): Promise<ApiResponse<void>> {
    return httpClient.delete(`/favorites/${gymId}`)
  },
}
