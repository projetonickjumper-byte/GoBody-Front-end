// Notifications Service - Serviço de notificações

import { httpClient, type ApiResponse } from "../http-client"

export interface Notification {
  id: string
  type: "promo" | "reserva" | "conquista" | "social" | "sistema"
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
  image?: string
}

export const notificationsService = {
  // Listar notificações do usuário
  async getAll(): Promise<ApiResponse<Notification[]>> {
    return httpClient.get("/notifications")
  },

  // Marcar notificação como lida
  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return httpClient.put(`/notifications/${id}/read`)
  },

  // Marcar todas como lidas
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return httpClient.put("/notifications/read-all")
  },

  // Excluir notificação
  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(`/notifications/${id}`)
  },

  // Excluir todas notificações
  async deleteAll(): Promise<ApiResponse<void>> {
    return httpClient.delete("/notifications/all")
  },
}
