"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { AppShell } from "@/components/app-shell"
import { BannerCarousel } from "@/components/home/banner-carousel"
import { CategoryGrid } from "@/components/home/category-grid"
import { NearbySection } from "@/components/home/nearby-section"
import { TopRatedSection } from "@/components/home/top-rated-section"
import { PromotionsSection } from "@/components/home/promotions-section"
import { WelcomeCard } from "@/components/home/welcome-card"
import { gymsService } from "@/lib/api/services/gyms.service"
import { bannersService } from "@/lib/api/services/banners.service"
import { promotionsService } from "@/lib/api/services/promotions.service"
import type { Gym, Banner, Category, Promotion } from "@/lib/types"

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [gyms, setGyms] = useState<Gym[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [bannersRes, categoriesRes, gymsRes, promotionsRes] = await Promise.all([
          bannersService.getAll(),
          gymsService.getCategories(),
          gymsService.getAll({ sortBy: "rating", pageSize: 10 }),
          promotionsService.getAll(),
        ])

        if (bannersRes.success && bannersRes.data) setBanners(bannersRes.data)
        if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data)
        if (gymsRes.success && gymsRes.data) setGyms(gymsRes.data)
        if (promotionsRes.success && promotionsRes.data) setPromotions(promotionsRes.data)
      } catch (error) {
        console.error("Erro ao carregar dados da home:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-950 pb-20 lg:pb-8">
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-8 lg:space-y-10">
            {/* Welcome Card - full width */}
            <WelcomeCard />
            
            <BannerCarousel banners={banners} />

            <CategoryGrid categories={categories} />

            <PromotionsSection promotions={promotions} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <NearbySection gyms={gyms} />
              <TopRatedSection gyms={gyms} />
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  )
}
