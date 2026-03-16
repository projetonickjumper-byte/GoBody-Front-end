import { notFound } from "next/navigation"
import { GymPageClient } from "./gym-page-client"
import { API_CONFIG } from "@/lib/api/config"

interface GymPageProps {
  params: Promise<{ slug: string }>
}

async function getGymBySlug(slug: string) {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GYMS.BY_SLUG(slug)}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = await res.json()
    return data
  } catch {
    return null
  }
}

async function getReviewsByGymId(gymId: string) {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REVIEWS.BY_GYM(gymId)}`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return data
  } catch {
    return []
  }
}

async function getRankingData() {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/ranking`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return data
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: GymPageProps) {
  const { slug } = await params
  const gym = await getGymBySlug(slug)

  if (!gym) {
    return { title: "Academia nao encontrada" }
  }

  return {
    title: `${gym.name} - FitApp`,
    description: gym.description?.slice(0, 160) || "",
  }
}

export default async function GymPage({ params }: GymPageProps) {
  const { slug } = await params
  const gym = await getGymBySlug(slug)

  if (!gym) {
    notFound()
  }

  const [reviews, fitRankEntries] = await Promise.all([
    getReviewsByGymId(gym.id),
    getRankingData(),
  ])

  return (
    <GymPageClient
      gym={gym}
      reviews={reviews}
      products={[]}
      classes={[]}
      fitRankEntries={fitRankEntries}
    />
  )
}
