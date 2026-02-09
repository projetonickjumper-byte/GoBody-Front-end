import type {
  Gym,
  Category,
  Banner,
  Promotion,
  Review,
  FitRankEntry,
  GymProduct,
  User,
  Achievement,
  Reservation,
  PersonalTrainer,
  GymClass,
} from "./types"

// Categories
export const categories: Category[] = [
  { id: "1", name: "Academias", slug: "academias", icon: "dumbbell", count: 248 },
  { id: "2", name: "Studios", slug: "studios", icon: "building", count: 86 },
  { id: "3", name: "Lutas", slug: "lutas", icon: "swords", count: 64 },
  { id: "4", name: "Pilates", slug: "pilates", icon: "stretch", count: 112 },
  { id: "5", name: "Danças", slug: "dancas", icon: "music", count: 45 },
  { id: "6", name: "Crossfit", slug: "crossfit", icon: "flame", count: 38 },
  { id: "7", name: "Personal Trainer", slug: "personal-trainer", icon: "user-check", count: 156 },
  { id: "8", name: "Aquaticas", slug: "aquaticas", icon: "waves", count: 42 },
  { id: "9", name: "Quadra de Areia", slug: "quadra-areia", icon: "sun", count: 31 },
  { id: "10", name: "Quadra Society", slug: "quadra-society", icon: "trophy", count: 27 },
]

// Banners
export const banners: Banner[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop",
    title: "Primeira aula grátis",
    subtitle: "Experimente a melhor academia da região",
    link: "/academia/smartfit-paulista",
    gymId: "1",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=600&fit=crop",
    title: "30% OFF no plano anual",
    subtitle: "Aproveite essa promoção por tempo limitado",
    link: "/academia/bluefit-moema",
    gymId: "2",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&h=600&fit=crop",
    title: "Crossfit Challenge 2026",
    subtitle: "Participe e ganhe prêmios incríveis",
    link: "/academia/crossfit-box-sp",
    gymId: "3",
  },
]

// Gyms
export const gyms: Gym[] = [
  {
    id: "1",
    name: "SmartFit Paulista",
    slug: "smartfit-paulista",
    description: "A SmartFit Paulista oferece estrutura completa para seu treino, com equipamentos de última geração, aulas coletivas variadas e ambiente climatizado. Nossa equipe de profissionais está sempre pronta para ajudar você a alcançar seus objetivos.",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    distance: 0.8,
    latitude: -23.5614,
    longitude: -46.6566,
    phone: "(11) 3000-0001",
    whatsapp: "5511930000001",
    email: "paulista@smartfit.com.br",
    website: "https://smartfit.com.br",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop",
    ],
    verified: true,
    rating: 4.7,
    totalReviews: 1248,
    totalCheckins: 45820,
    modalities: ["Musculação", "Cardio", "Funcional", "Spinning", "Yoga", "Pilates"],
    amenities: ["Ar condicionado", "Vestiários", "Armários", "Estacionamento", "Wi-Fi", "Água gratuita"],
    openingHours: {
      monday: { open: "06:00", close: "23:00" },
      tuesday: { open: "06:00", close: "23:00" },
      wednesday: { open: "06:00", close: "23:00" },
      thursday: { open: "06:00", close: "23:00" },
      friday: { open: "06:00", close: "22:00" },
      saturday: { open: "08:00", close: "18:00" },
      sunday: { open: "08:00", close: "14:00" },
    },
    isOpen: true,
    plans: [
      {
        id: "p1",
        name: "Mensal",
        type: "monthly",
        price: 119.9,
        features: ["Acesso ilimitado", "Todas as modalidades", "App exclusivo"],
      },
      {
        id: "p2",
        name: "Trimestral",
        type: "quarterly",
        price: 99.9,
        originalPrice: 119.9,
        features: ["Acesso ilimitado", "Todas as modalidades", "App exclusivo", "1 avaliação física"],
        popular: true,
      },
      {
        id: "p3",
        name: "Anual",
        type: "annual",
        price: 79.9,
        originalPrice: 119.9,
        features: ["Acesso ilimitado", "Todas as modalidades", "App exclusivo", "4 avaliações físicas", "Personal 1x/mês"],
        hasFreeTrial: true,
        trialDays: 7,
      },
    ],
    dayUse: {
      price: 29.9,
      originalPrice: 49.9,
      duration: "1 dia",
      availableHours: "06:00 - 23:00",
      firstExperienceDiscount: 30,
      cancellationPolicy: "Cancelamento gratuito até 2h antes",
    },
    acceptsWellhub: true,
    acceptsTotalPass: true,
    hasFreeTrial: true,
  },
  {
    id: "2",
    name: "BlueFit Moema",
    slug: "bluefit-moema",
    description: "A BlueFit Moema é referência em treino funcional e crossfit na zona sul de São Paulo. Ambiente moderno, equipamentos importados e treinadores certificados internacionalmente.",
    address: "Alameda dos Arapanes, 500",
    city: "São Paulo",
    state: "SP",
    distance: 2.3,
    latitude: -23.6023,
    longitude: -46.6658,
    phone: "(11) 3000-0002",
    whatsapp: "5511930000002",
    email: "moema@bluefit.com.br",
    images: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop",
    ],
    verified: true,
    rating: 4.9,
    totalReviews: 892,
    totalCheckins: 32150,
    modalities: ["Crossfit", "Funcional", "HIIT", "Levantamento olímpico"],
    amenities: ["Ar condicionado", "Vestiários", "Estacionamento", "Loja", "Café"],
    openingHours: {
      monday: { open: "06:00", close: "22:00" },
      tuesday: { open: "06:00", close: "22:00" },
      wednesday: { open: "06:00", close: "22:00" },
      thursday: { open: "06:00", close: "22:00" },
      friday: { open: "06:00", close: "21:00" },
      saturday: { open: "08:00", close: "16:00" },
      sunday: null,
    },
    isOpen: true,
    plans: [
      {
        id: "p1",
        name: "Mensal",
        type: "monthly",
        price: 199.9,
        features: ["Acesso ilimitado", "Aulas coletivas", "App de treinos"],
      },
      {
        id: "p2",
        name: "Trimestral",
        type: "quarterly",
        price: 169.9,
        originalPrice: 199.9,
        features: ["Acesso ilimitado", "Aulas coletivas", "App de treinos", "Camisa exclusiva"],
        popular: true,
      },
    ],
    dayUse: {
      price: 49.9,
      duration: "1 dia",
      availableHours: "06:00 - 22:00",
      cancellationPolicy: "Não reembolsável",
    },
    acceptsWellhub: true,
    acceptsTotalPass: false,
    hasFreeTrial: false,
  },
  {
    id: "3",
    name: "Crossfit Box SP",
    slug: "crossfit-box-sp",
    description: "Box de Crossfit com estrutura premium, coaches certificados Level 2 e comunidade engajada. Participe dos nossos WODs e transforme seu corpo.",
    address: "Rua Augusta, 2000",
    city: "São Paulo",
    state: "SP",
    distance: 1.5,
    latitude: -23.5558,
    longitude: -46.6628,
    phone: "(11) 3000-0003",
    whatsapp: "5511930000003",
    email: "contato@crossfitboxsp.com.br",
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    ],
    verified: true,
    rating: 4.8,
    totalReviews: 456,
    totalCheckins: 18920,
    modalities: ["Crossfit", "Weightlifting", "Gymnastics"],
    amenities: ["Ar condicionado", "Vestiários", "Armários", "Loja"],
    openingHours: {
      monday: { open: "06:00", close: "21:00" },
      tuesday: { open: "06:00", close: "21:00" },
      wednesday: { open: "06:00", close: "21:00" },
      thursday: { open: "06:00", close: "21:00" },
      friday: { open: "06:00", close: "20:00" },
      saturday: { open: "08:00", close: "14:00" },
      sunday: null,
    },
    isOpen: true,
    plans: [
      {
        id: "p1",
        name: "Mensal",
        type: "monthly",
        price: 249.9,
        features: ["Acesso ilimitado", "Todos os WODs", "Acompanhamento"],
      },
      {
        id: "p2",
        name: "Anual",
        type: "annual",
        price: 189.9,
        originalPrice: 249.9,
        features: ["Acesso ilimitado", "Todos os WODs", "Acompanhamento", "Competições internas"],
        popular: true,
      },
    ],
    dayUse: null,
    acceptsWellhub: false,
    acceptsTotalPass: false,
    hasFreeTrial: true,
  },
  {
    id: "4",
    name: "Studio Pilates Vida",
    slug: "studio-pilates-vida",
    description: "Studio de Pilates com aparelhos Balanced Body, instrutoras especializadas e ambiente acolhedor. Atendimento individual e em pequenos grupos.",
    address: "Rua Oscar Freire, 800",
    city: "São Paulo",
    state: "SP",
    distance: 3.1,
    latitude: -23.5634,
    longitude: -46.6756,
    phone: "(11) 3000-0004",
    whatsapp: "5511930000004",
    email: "contato@pilatesvida.com.br",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    ],
    verified: true,
    rating: 4.9,
    totalReviews: 324,
    totalCheckins: 12450,
    modalities: ["Pilates Aparelhos", "Pilates Solo", "Pilates Gestantes"],
    amenities: ["Ar condicionado", "Vestiários", "Água", "Estacionamento"],
    openingHours: {
      monday: { open: "07:00", close: "21:00" },
      tuesday: { open: "07:00", close: "21:00" },
      wednesday: { open: "07:00", close: "21:00" },
      thursday: { open: "07:00", close: "21:00" },
      friday: { open: "07:00", close: "20:00" },
      saturday: { open: "08:00", close: "14:00" },
      sunday: null,
    },
    isOpen: true,
    plans: [
      {
        id: "p1",
        name: "4 aulas/mes",
        type: "monthly",
        price: 320,
        features: ["4 aulas mensais", "Aulas individuais ou dupla", "Horario fixo"],
      },
      {
        id: "p2",
        name: "8 aulas/mes",
        type: "monthly",
        price: 580,
        originalPrice: 640,
        features: ["8 aulas mensais", "Aulas individuais ou dupla", "Horário flexível"],
        popular: true,
      },
    ],
    dayUse: {
      price: 89.9,
      duration: "1 aula",
      availableHours: "Mediante agendamento",
      cancellationPolicy: "Cancelamento até 24h antes",
    },
    acceptsWellhub: false,
    acceptsTotalPass: false,
    hasFreeTrial: true,
  },
]

// Promotions
export const promotions: Promotion[] = [
  {
    id: "1",
    gymId: "1",
    gymName: "SmartFit Paulista",
    gymImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    title: "Day Use Relâmpago",
    description: "Aproveite 50% de desconto no day use hoje!",
    discount: 50,
    originalPrice: 49.9,
    finalPrice: 24.95,
    type: "day_use",
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    countdown: true,
  },
  {
    id: "2",
    gymId: "2",
    gymName: "BlueFit Moema",
    gymImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop",
    title: "Primeira aula grátis",
    description: "Experimente uma aula de crossfit sem compromisso",
    discount: 100,
    originalPrice: 49.9,
    finalPrice: 0,
    type: "first_class",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    countdown: false,
  },
  {
    id: "3",
    gymId: "3",
    gymName: "Crossfit Box SP",
    gymImage: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop",
    title: "30% OFF plano anual",
    description: "Assine o plano anual e economize R$ 720 por ano",
    discount: 30,
    originalPrice: 249.9,
    finalPrice: 174.93,
    type: "plan",
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    countdown: true,
  },
]

// Reviews
export const reviews: Review[] = [
  {
    id: "r1",
    gymId: "1",
    userId: "u1",
    userName: "Carlos Silva",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    userLevel: 12,
    rating: 5,
    text: "Excelente academia! Equipamentos sempre em ótimo estado, ambiente limpo e profissionais muito atenciosos. Frequento há 2 anos e recomendo muito.",
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"],
    date: "2026-01-15",
    helpful: 24,
    modality: "Musculação",
    gymResponse: {
      text: "Obrigado pelo feedback, Carlos! Ficamos felizes em ter você como aluno. Conte sempre conosco!",
      date: "2026-01-16",
    },
  },
  {
    id: "r2",
    gymId: "1",
    userId: "u2",
    userName: "Ana Paula",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    userLevel: 8,
    rating: 4,
    text: "Ótima estrutura e boas aulas de spinning. Único ponto negativo é que fica lotado no horário de pico.",
    date: "2026-01-10",
    helpful: 12,
    modality: "Spinning",
  },
  {
    id: "r3",
    gymId: "1",
    userId: "u3",
    userName: "Roberto Costa",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    userLevel: 15,
    rating: 5,
    text: "Melhor academia que já frequentei. As aulas de funcional são incríveis e os instrutores muito capacitados.",
    date: "2026-01-05",
    helpful: 18,
    modality: "Funcional",
  },
]

// FitRank
export const fitRankEntries: FitRankEntry[] = [
  { position: 1, userId: "u10", userName: "Marcelo Ferreira", userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", points: 2450, checkins: 28, streak: 21 },
  { position: 2, userId: "u11", userName: "Julia Santos", userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", points: 2280, checkins: 26, streak: 18 },
  { position: 3, userId: "u12", userName: "Pedro Oliveira", userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", points: 2150, checkins: 25, streak: 15 },
  { position: 4, userId: "u13", userName: "Camila Lima", userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", points: 1980, checkins: 23, streak: 12 },
  { position: 5, userId: "u14", userName: "Rafael Mendes", userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", points: 1850, checkins: 22, streak: 10 },
  { position: 6, userId: "u1", userName: "Você", userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face", points: 1240, checkins: 15, streak: 7 },
]

// Products
export const gymProducts: GymProduct[] = [
  {
    id: "prod1",
    gymId: "1",
    name: "Camiseta SmartFit Dry-Fit",
    description: "Camiseta oficial SmartFit em tecido dry-fit, ideal para treinos intensos.",
    price: 79.9,
    originalPrice: 99.9,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"],
    category: "Vestuário",
    stock: 45,
    rating: 4.5,
    totalReviews: 128,
  },
  {
    id: "prod2",
    gymId: "1",
    name: "Garrafa Termica 1L",
    description: "Garrafa térmica de 1 litro, mantém temperatura por 12h.",
    price: 59.9,
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop"],
    category: "Acessórios",
    stock: 30,
    rating: 4.8,
    totalReviews: 86,
  },
  {
    id: "prod3",
    gymId: "1",
    name: "Whey Protein 900g",
    description: "Whey Protein concentrado sabor chocolate, 30 doses.",
    price: 129.9,
    originalPrice: 159.9,
    images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop"],
    category: "Suplementos",
    stock: 22,
    rating: 4.6,
    totalReviews: 234,
  },
  {
    id: "prod4",
    gymId: "1",
    name: "Luva de Treino Pro",
    description: "Luva profissional para musculação com suporte de punho.",
    price: 89.9,
    images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop"],
    category: "Acessórios",
    stock: 15,
    rating: 4.7,
    totalReviews: 67,
  },
]

// Current User
export const currentUser: User = {
  id: "u1",
  name: "Joao Pedro",
  email: "joao.pedro@email.com",
  phone: "(11) 98765-4321",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  bio: "Apaixonado por musculação e crossfit. Treinando desde 2020.",
  birthDate: "1995-03-15",
  gender: "male",
  fitnessGoals: ["Ganhar massa muscular", "Melhorar condicionamento"],
  totalCheckins: 42,
  totalFavorites: 12,
  totalAchievements: 6,
  xp: 1240,
  level: 8,
  memberSince: "2024-06-15",
}

// Achievements
export const achievements: Achievement[] = [
  {
    id: "a1",
    name: "Primeiro Check-in",
    description: "Faça seu primeiro check-in em uma academia",
    icon: "check-circle",
    unlockedAt: "2024-06-15",
    xpReward: 50,
    requirement: "1 check-in",
  },
  {
    id: "a2",
    name: "Frequentador",
    description: "Complete 10 check-ins",
    icon: "calendar",
    unlockedAt: "2024-07-20",
    xpReward: 100,
    requirement: "10 check-ins",
  },
  {
    id: "a3",
    name: "Streak de 7 dias",
    description: "Treine 7 dias seguidos",
    icon: "flame",
    unlockedAt: "2024-08-10",
    xpReward: 150,
    requirement: "7 dias consecutivos",
  },
  {
    id: "a4",
    name: "Avaliador",
    description: "Escreva sua primeira avaliação",
    icon: "star",
    unlockedAt: "2024-08-15",
    xpReward: 75,
    requirement: "1 avaliação",
  },
  {
    id: "a5",
    name: "Explorador",
    description: "Visite 5 academias diferentes",
    icon: "map",
    unlockedAt: "2024-09-01",
    xpReward: 200,
    requirement: "5 academias",
  },
  {
    id: "a6",
    name: "Influenciador",
    description: "Indique um amigo que se cadastrou",
    icon: "users",
    unlockedAt: "2024-10-05",
    xpReward: 250,
    requirement: "1 indicação",
  },
  {
    id: "a7",
    name: "Dedicado",
    description: "Complete 50 check-ins",
    icon: "award",
    xpReward: 300,
    requirement: "50 check-ins",
  },
  {
    id: "a8",
    name: "Lenda",
    description: "Complete 100 check-ins",
    icon: "trophy",
    xpReward: 500,
    requirement: "100 check-ins",
  },
]

// Reservations
export const reservations: Reservation[] = [
  {
    id: "res1",
    gymId: "1",
    gymName: "SmartFit Paulista",
    gymImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    date: "2026-02-01",
    time: "18:00",
    type: "class",
    className: "Spinning Intenso",
    instructorName: "Patricia Lima",
    status: "confirmed",
    cancellationDeadline: "2026-02-01T16:00:00",
  },
  {
    id: "res2",
    gymId: "2",
    gymName: "BlueFit Moema",
    gymImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop",
    date: "2026-02-03",
    time: "07:00",
    type: "class",
    className: "WOD Crossfit",
    instructorName: "Lucas Martins",
    status: "pending",
    cancellationDeadline: "2026-02-03T05:00:00",
  },
]

// Personal Trainers
export const personalTrainers: PersonalTrainer[] = [
  {
    id: "pt1",
    gymId: "1",
    name: "Ricardo Almeida",
    avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face",
    specialties: ["Musculação", "Emagrecimento", "Hipertrofia"],
    rating: 4.9,
    totalReviews: 87,
    pricePerHour: 120,
    bio: "Personal trainer certificado CREF com 8 anos de experiência. Especialista em transformação corporal.",
    certifications: ["CREF", "NSCA-CPT", "Funcional"],
  },
  {
    id: "pt2",
    gymId: "1",
    name: "Fernanda Costa",
    avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face",
    specialties: ["Funcional", "Pilates", "Gestantes"],
    rating: 4.8,
    totalReviews: 64,
    pricePerHour: 150,
    bio: "Especialista em treinamento funcional e pilates. Trabalho com gestantes e pós-parto.",
    certifications: ["CREF", "Pilates Polestar", "Gestante Fit"],
  },
]

// Gym Classes
export const gymClasses: GymClass[] = [
  { id: "c1", gymId: "1", name: "Spinning Intenso", instructor: "Patricia Lima", time: "07:00", duration: 45, spots: 25, spotsAvailable: 8, day: "Segunda" },
  { id: "c2", gymId: "1", name: "Yoga Flow", instructor: "Marina Santos", time: "08:00", duration: 60, spots: 20, spotsAvailable: 5, day: "Segunda" },
  { id: "c3", gymId: "1", name: "Funcional HIIT", instructor: "Carlos Oliveira", time: "12:00", duration: 30, spots: 15, spotsAvailable: 3, day: "Segunda" },
  { id: "c4", gymId: "1", name: "Spinning Intenso", instructor: "Patricia Lima", time: "18:00", duration: 45, spots: 25, spotsAvailable: 0, day: "Segunda" },
  { id: "c5", gymId: "1", name: "Body Pump", instructor: "Ricardo Almeida", time: "19:00", duration: 50, spots: 30, spotsAvailable: 12, day: "Segunda" },
  { id: "c6", gymId: "1", name: "Pilates Solo", instructor: "Fernanda Costa", time: "20:00", duration: 50, spots: 15, spotsAvailable: 7, day: "Segunda" },
]

// Helper functions
export function getGymBySlug(slug: string): Gym | undefined {
  return gyms.find((g) => g.slug === slug)
}

export function getGymById(id: string): Gym | undefined {
  return gyms.find((g) => g.id === id)
}

export function getReviewsByGymId(gymId: string): Review[] {
  return reviews.filter((r) => r.gymId === gymId)
}

export function getProductsByGymId(gymId: string): GymProduct[] {
  return gymProducts.filter((p) => p.gymId === gymId)
}

export function getClassesByGymId(gymId: string): GymClass[] {
  return gymClasses.filter((c) => c.gymId === gymId)
}

export function getTrainersByGymId(gymId: string): PersonalTrainer[] {
  return personalTrainers.filter((t) => t.gymId === gymId)
}

// Aliases for backward compatibility
export const mockGyms = gyms
export const mockCategories = categories
export const mockUser = currentUser
export const mockBanners = banners
export const mockPromotions = promotions
export const mockReviews = reviews
