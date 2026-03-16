// Checkins Service - Serviço de check-ins

import { httpClient, type ApiResponse } from "../http-client"

export interface CheckIn {
  id: string
  userId: string
  gymId: string
  gym?: {
    name: string
    images: string
  }
  createdAt: string
}

export const checkinsService = {
  // Fazer check-in
  async create(gymId: string): Promise<ApiResponse<CheckIn>> {
    return httpClient.post("/checkins", { gymId })
  },

  // Listar histórico de check-ins
  async getHistory(userId?: string): Promise<ApiResponse<CheckIn[]>> {
    const params = userId ? `?userId=${userId}` : ""
    return httpClient.get(`/checkins${params}`)
  },
}
