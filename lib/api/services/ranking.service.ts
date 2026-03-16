// Ranking Service - Serviço de ranking e conquistas

import { httpClient, type ApiResponse } from "../http-client"
import type { FitRankEntry, Achievement } from "@/lib/types"

export const rankingService = {
  // Obter ranking geral
  async getRanking(): Promise<ApiResponse<FitRankEntry[]>> {
    return httpClient.get("/ranking")
  },

  // Obter conquistas
  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    return httpClient.get("/ranking/achievements")
  },
}
