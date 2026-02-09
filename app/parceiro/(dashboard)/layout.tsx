"use client"

import React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Calendar,
  Package,
  ShoppingBag,
  Users,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Building2,
  ChevronDown,
  Dumbbell,
  ClipboardList,
  ShoppingCart,
  ChevronRight,
  Search,
  DollarSign,
  Wallet,
  Receipt,
  CreditCard,
  Landmark,
  BadgeDollarSign,
  ShoppingBasket,
  Handshake,
  Target,
  Lightbulb,
  Activity,
  Bot,
  Gift,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

type SidebarItem = {
  href: string
  icon: React.ElementType
  label: string
  badge?: number
}

type SidebarGroup = {
  label: string
  icon: React.ElementType
  children: SidebarItem[]
}

type SidebarEntry = SidebarItem | SidebarGroup

function isGroup(entry: SidebarEntry): entry is SidebarGroup {
  return "children" in entry
}

const sidebarEntries: SidebarEntry[] = [
  { href: "/parceiro/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/parceiro/pedidos", icon: ShoppingCart, label: "Pedidos", badge: 3 },
  { href: "/parceiro/agenda", icon: Calendar, label: "Agenda" },
  { href: "/parceiro/treinos", icon: Dumbbell, label: "Treinos" },
  { href: "/parceiro/avaliacao-fisica", icon: ClipboardList, label: "Avaliacao Fisica" },
  { href: "/parceiro/servicos", icon: Package, label: "Servicos" },
  { href: "/parceiro/produtos", icon: ShoppingBag, label: "Produtos" },
  { href: "/parceiro/clientes", icon: Users, label: "Clientes" },
  // Financeiro
  {
    label: "Financeiro",
    icon: DollarSign,
    children: [
      { href: "/parceiro/financeiro/caixa", icon: Wallet, label: "Caixa" },
      { href: "/parceiro/financeiro/comissao", icon: BadgeDollarSign, label: "Comissao" },
      { href: "/parceiro/financeiro/contas-pagar", icon: Receipt, label: "Contas a Pagar" },
      { href: "/parceiro/financeiro/contas-receber", icon: CreditCard, label: "Contas a Receber" },
      { href: "/parceiro/financeiro/contas-financeiras", icon: Landmark, label: "Contas Financeiras" },
      { href: "/parceiro/financeiro/vendas", icon: ShoppingBasket, label: "Vendas" },
    ],
  },
  // CRM
  {
    label: "CRM",
    icon: Handshake,
    children: [
      { href: "/parceiro/crm/leads", icon: Target, label: "Leads" },
      { href: "/parceiro/crm/oportunidades", icon: Lightbulb, label: "Oportunidades" },
      { href: "/parceiro/crm/atividades", icon: Activity, label: "Atividades" },
      { href: "/parceiro/crm/automacoes", icon: Bot, label: "Automacoes" },
      { href: "/parceiro/crm/recompensas", icon: Gift, label: "Clube de Recompensas" },
    ],
  },
  { href: "/parceiro/avaliacoes", icon: Star, label: "Avaliacoes" },
  { href: "/parceiro/relatorios", icon: BarChart3, label: "Relatorios" },
  { href: "/parceiro/configuracoes", icon: Settings, label: "Configuracoes" },
]

export default function PartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const pathname = usePathname()

  // Auto-expand group if current path is inside it
  useEffect(() => {
    sidebarEntries.forEach((entry) => {
      if (isGroup(entry)) {
        const isInside = entry.children.some((child) => pathname.startsWith(child.href))
        if (isInside && !expandedGroups.includes(entry.label)) {
          setExpandedGroups((prev) => [...prev, entry.label])
        }
      }
    })
  }, [pathname])
  const { user, isAuthenticated, isPartner, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isPartner)) {
      router.push("/parceiro/login")
    }
  }, [isAuthenticated, isPartner, isLoading, router])

  // Fecha sidebar ao mudar de rota no mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (isLoading || !isAuthenticated || !isPartner) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  const partnerUser = user as {
    businessName: string
    businessType: string
    isVerified: boolean
    planType: string
    name: string
    avatar: string | null
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 transform bg-zinc-950 border-r border-zinc-800/50 transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800/50">
            <Link href="/parceiro/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
                <span className="text-lg font-bold text-white">F</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">FitApp</span>
                <span className="text-xs text-orange-500 -mt-0.5">Parceiros</span>
              </div>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Business Info Card */}
          <div className="p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20">
                <Building2 className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate text-sm">{partnerUser.businessName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-zinc-500 capitalize">{partnerUser.businessType}</span>
                  {partnerUser.isVerified && (
                    <Badge className="text-[9px] px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                      Verificado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
            {sidebarEntries.map((entry) => {
              if (isGroup(entry)) {
                const isExpanded = expandedGroups.includes(entry.label)
                const isGroupActive = entry.children.some((child) => pathname.startsWith(child.href))
                return (
                  <div key={entry.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedGroups((prev) =>
                          prev.includes(entry.label)
                            ? prev.filter((g) => g !== entry.label)
                            : [...prev, entry.label]
                        )
                      }
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isGroupActive
                          ? "text-orange-500"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                      )}
                    >
                      <entry.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isGroupActive ? "text-orange-500" : "text-zinc-500 group-hover:text-zinc-300"
                      )} />
                      <span className="flex-1 text-left">{entry.label}</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded ? "rotate-0" : "-rotate-90",
                        isGroupActive ? "text-orange-500/50" : "text-zinc-600"
                      )} />
                    </button>
                    <div className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <div className="ml-4 pl-4 border-l border-zinc-800/50 space-y-0.5 py-1">
                        {entry.children.map((child) => {
                          const isChildActive = pathname === child.href
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                                isChildActive
                                  ? "bg-orange-500/10 text-orange-500 font-medium"
                                  : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                              )}
                            >
                              <child.icon className={cn(
                                "h-4 w-4 transition-colors",
                                isChildActive ? "text-orange-500" : "text-zinc-600 group-hover:text-zinc-400"
                              )} />
                              <span>{child.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              }

              const item = entry as SidebarItem
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-orange-500/10 text-orange-500 border-l-2 border-orange-500"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-orange-500" : "text-zinc-500 group-hover:text-zinc-300"
                  )} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white px-1.5">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-orange-500/50" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Plan Card */}
          <div className="p-4 border-t border-zinc-800/50">
            <div className="rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800/50 p-4">
              <p className="text-xs text-zinc-500 mb-1">Plano atual</p>
              <p className="font-semibold text-white capitalize">{partnerUser.planType}</p>
              {partnerUser.planType !== "premium" && (
                <Button size="sm" className="w-full mt-3 h-9 text-xs bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0">
                  Fazer upgrade
                </Button>
              )}
            </div>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-zinc-800/50">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full p-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Sair da conta</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/95 backdrop-blur-xl px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50 w-64">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none flex-1"
              />
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded bg-zinc-800 px-1.5 text-[10px] font-medium text-zinc-400">
                Ctrl K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-zinc-800/50">
              <Bell className="h-5 w-5 text-zinc-400" />
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                5
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-zinc-800/50 transition-colors">
                  <Avatar className="h-9 w-9 border-2 border-zinc-700">
                    <AvatarImage src={partnerUser.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold">
                      {partnerUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">{partnerUser.name}</p>
                    <p className="text-xs text-zinc-500">{partnerUser.businessType}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-500 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-white">{partnerUser.name}</p>
                  <p className="text-xs text-zinc-500">{partnerUser.businessName}</p>
                </div>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
                  <Link href="/parceiro/configuracoes">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuracoes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem onClick={logout} className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
