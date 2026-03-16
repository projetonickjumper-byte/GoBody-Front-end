// API Services - Ponto de entrada principal
// Importe os serviços daqui para usar em toda a aplicação

// Configuração
export { API_CONFIG, buildUrl } from "./config"

// HTTP Client
export { httpClient, isMockMode, simulateNetworkDelay } from "./http-client"
export type { ApiResponse, PaginatedResponse } from "./http-client"

// Serviços
export { authService } from "./services/auth.service"
export { workoutsService } from "./services/workouts.service"
export { assessmentsService } from "./services/assessments.service"
export { studentsService } from "./services/students.service"
export { gymsService } from "./services/gyms.service"
export { adminService } from "./services/admin.service"
export { ordersService } from "./services/orders.service"
export { usersService } from "./services/users.service"
export { reservationsService } from "./services/reservations.service"
export { billingService } from "./services/billing.service"
export { checkinsService } from "./services/checkins.service"
export { favoritesService } from "./services/favorites.service"
export { rankingService } from "./services/ranking.service"
export { promotionsService } from "./services/promotions.service"
export { bannersService } from "./services/banners.service"
export { reviewsService } from "./services/reviews.service"
export { notificationsService } from "./services/notifications.service"

// Types re-exports
export type { ServiceOrder, CreateOrderDTO, OrderFilters } from "./services/orders.service"
export type { UpdateProfileData } from "./services/users.service"
export type { CreateReservationData } from "./services/reservations.service"
export type { BillingSummary, TransactionFilters, Invoice } from "./services/billing.service"
export type { CheckIn } from "./services/checkins.service"
export type { FavoriteGym } from "./services/favorites.service"
export type { CreateReviewData } from "./services/reviews.service"
export type { Notification } from "./services/notifications.service"
