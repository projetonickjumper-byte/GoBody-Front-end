"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Eye, 
  EyeOff, 
  Building2, 
  Dumbbell, 
  Lock, 
  Mail, 
  ArrowRight,
  Users,
  Calendar,
  TrendingUp,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function PartnerLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isAuthenticated, isPartner, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && isPartner) {
      router.push("/parceiro/dashboard")
    }
  }, [isAuthenticated, isPartner, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const result = await login(email, password, "partner")
    
    if (result.success) {
      router.push("/parceiro/dashboard")
    } else {
      setError(result.error || "Erro ao fazer login")
    }
    
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <span className="text-sm text-zinc-500">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
             }}
        />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-zinc-100">FitApp</span>
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-md">
                Parceiros
              </span>
            </div>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-zinc-100 leading-tight mb-4">
              Gerencie seu
              <span className="text-orange-500"> negócio fitness</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-8">
              Dashboard completo para academias, personal trainers e profissionais da saúde.
            </p>
            
            {/* Feature Cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm transition-all hover:bg-zinc-900/70">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-medium text-zinc-200">Academias e Studios</h3>
                  <p className="text-sm text-zinc-500">Gerencie planos, aulas e alunos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm transition-all hover:bg-zinc-900/70">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-zinc-200">Personal Trainers</h3>
                  <p className="text-sm text-zinc-500">Agenda, clientes e pagamentos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm transition-all hover:bg-zinc-900/70">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-medium text-zinc-200">Relatórios Detalhados</h3>
                  <p className="text-sm text-zinc-500">Acompanhe seu crescimento</p>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-8 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-100">1.2K+</span>
                <span className="text-xs text-zinc-500">Parceiros ativos</span>
              </div>
              <div className="w-px h-10 bg-zinc-800" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-100">4.9</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span className="text-xs text-zinc-500">Avaliação</span>
                </div>
              </div>
              <div className="w-px h-10 bg-zinc-800" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-100">98%</span>
                <span className="text-xs text-zinc-500">Satisfação</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-zinc-600">
            2026 FitApp. Todos os direitos reservados.
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-zinc-100">FitApp</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">Portal de Parceiros</span>
            </div>
          </div>
          
          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-2">Acesse sua conta</h2>
            <p className="text-zinc-500">Entre para gerenciar seu negócio</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs">!</span>
                </div>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-orange-500/50 focus-visible:border-orange-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300 text-sm">Senha</Label>
                <Link
                  href="/parceiro/esqueci-senha"
                  className="text-xs text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-orange-500/50 focus-visible:border-orange-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Acessar Dashboard
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-3 text-zinc-600">ou</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-zinc-500">
                Ainda não tem uma conta?{" "}
                <Link href="/parceiro/cadastro" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
                  Cadastre-se gratuitamente
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <div className="flex items-center justify-center gap-6">
              <Link 
                href="/login" 
                className="text-sm text-zinc-500 hover:text-orange-500 transition-colors inline-flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                Sou cliente
              </Link>
              <div className="w-px h-4 bg-zinc-800" />
              <Link 
                href="/" 
                className="text-sm text-zinc-500 hover:text-orange-500 transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                Voltar ao site
              </Link>
            </div>
          </div>


          {/* Credentials hint for demo */}
        
          
             
            
        
           
         
        </div>
      </div>
    </div>
  )
}
