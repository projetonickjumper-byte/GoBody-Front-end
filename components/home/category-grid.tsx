"use client"

import React from "react"
import Link from "next/link"
import { Dumbbell, Building2, Swords, Flame, Music, Sparkles, ChevronRight, UserCheck, Waves, Sun, Trophy } from "lucide-react"
import type { Category } from "@/lib/types"

const iconMap: Record<string, React.ElementType> = {
  dumbbell: Dumbbell,
  building: Building2,
  swords: Swords,
  stretch: Sparkles,
  music: Music,
  flame: Flame,
  "user-check": UserCheck,
  waves: Waves,
  sun: Sun,
  trophy: Trophy,
}

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  dumbbell: { bg: "from-orange-500/20 to-orange-600/10", text: "text-orange-500", glow: "group-hover:shadow-orange-500/20" },
  building: { bg: "from-blue-500/20 to-blue-600/10", text: "text-blue-500", glow: "group-hover:shadow-blue-500/20" },
  swords: { bg: "from-red-500/20 to-red-600/10", text: "text-red-500", glow: "group-hover:shadow-red-500/20" },
  stretch: { bg: "from-violet-500/20 to-violet-600/10", text: "text-violet-500", glow: "group-hover:shadow-violet-500/20" },
  music: { bg: "from-pink-500/20 to-pink-600/10", text: "text-pink-500", glow: "group-hover:shadow-pink-500/20" },
  flame: { bg: "from-amber-500/20 to-amber-600/10", text: "text-amber-500", glow: "group-hover:shadow-amber-500/20" },
  "user-check": { bg: "from-emerald-500/20 to-emerald-600/10", text: "text-emerald-500", glow: "group-hover:shadow-emerald-500/20" },
  waves: { bg: "from-cyan-500/20 to-cyan-600/10", text: "text-cyan-500", glow: "group-hover:shadow-cyan-500/20" },
  sun: { bg: "from-yellow-500/20 to-yellow-600/10", text: "text-yellow-500", glow: "group-hover:shadow-yellow-500/20" },
  trophy: { bg: "from-lime-500/20 to-lime-600/10", text: "text-lime-500", glow: "group-hover:shadow-lime-500/20" },
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="relative">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Modalidades</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Encontre o treino ideal para você</p>
        </div>
        <Link
          href="/buscar"
          className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 transition-colors group"
        >
          Ver todas
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Dumbbell
          const colors = colorMap[category.icon] || colorMap.dumbbell
          return (
            <Link
              key={category.id}
              href={`/buscar?categoria=${category.slug}`}
              className={`group relative flex flex-col items-center gap-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-5 transition-all hover:bg-zinc-800/50 hover:border-zinc-700/50 hover:shadow-lg ${colors.glow} hover:-translate-y-1`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colors.bg} transition-transform group-hover:scale-110`}>
                <Icon className={`h-7 w-7 ${colors.text}`} />
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-white">
                  {category.name}
                </span>
                <span className="text-xs text-zinc-500 mt-0.5">
                  {category.count} locais
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
