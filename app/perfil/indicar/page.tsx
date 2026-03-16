"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Share2, Users, Gift, Check, MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/lib/auth-context"

function GenerateReferralCode(name: string) {
  return "FITAPP-" + name.toUpperCase().replace(/\s/g, "").slice(0, 4) + "2026"
}

const rewards = [
  { friends: 1, reward: "+100 XP", description: "Primeiro amigo" },
  { friends: 3, reward: "+500 XP", description: "3 amigos" },
  { friends: 5, reward: "1 Day Use Gratis", description: "5 amigos" },
  { friends: 10, reward: "1 Mes Gratis", description: "10 amigos" },
]

const referredFriends = [
  { name: "Maria Silva", date: "2026-01-15", status: "ativo" },
  { name: "Joao Santos", date: "2026-01-10", status: "ativo" },
]

export default function IndicarPage() {
  const { user } = useAuth()
  const referralCode = GenerateReferralCode(user?.name || "USER")
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FitApp - Convite",
          text: `Use meu codigo ${referralCode} e ganhe 50 XP no FitApp!`,
          url: "https://fitapp.com/cadastro?ref=" + referralCode,
        })
      } catch (err) {
        // User cancelled share
      }
    }
  }

  const handleEmailInvite = () => {
    if (email) {
      setEmailSent(true)
      setEmail("")
      setTimeout(() => setEmailSent(false), 3000)
    }
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20 lg:pb-6">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto">
            <Link href="/perfil" className="lg:hidden">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Indicar Amigos</h1>
          </div>
        </div>

        <div className="p-4 max-w-4xl mx-auto space-y-6">
          {/* Hero Section */}
          <div className="rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Ganhe recompensas!
            </h2>
            <p className="text-muted-foreground">
              Convide amigos para o FitApp e ganhe XP e beneficios exclusivos
            </p>
          </div>

          {/* Referral Code */}
          <div className="rounded-xl bg-card border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">Seu codigo de indicacao</h3>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg bg-secondary px-4 py-3 font-mono text-lg font-bold text-foreground text-center">
                {referralCode}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0 bg-transparent"
              >
                {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground text-center">
              {copied ? "Codigo copiado!" : "Compartilhe este codigo com seus amigos"}
            </p>
          </div>

          {/* Share Options */}
          <div className="rounded-xl bg-card border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">Compartilhar via</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-col h-auto py-4 bg-transparent"
              >
                <Share2 className="h-5 w-5 mb-1" />
                <span className="text-xs">Compartilhar</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-4 bg-transparent"
                onClick={() => window.open(`https://wa.me/?text=Use%20meu%20codigo%20${referralCode}%20e%20ganhe%2050%20XP%20no%20FitApp!`, "_blank")}
              >
                <MessageCircle className="h-5 w-5 mb-1" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-4 bg-transparent"
                onClick={() => window.open(`mailto:?subject=Convite%20FitApp&body=Use%20meu%20codigo%20${referralCode}%20e%20ganhe%2050%20XP!`, "_blank")}
              >
                <Mail className="h-5 w-5 mb-1" />
                <span className="text-xs">Email</span>
              </Button>
            </div>
          </div>

          {/* Email Invite */}
          <div className="rounded-xl bg-card border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">Convidar por email</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleEmailInvite} disabled={!email}>
                Enviar
              </Button>
            </div>
            {emailSent && (
              <p className="mt-2 text-sm text-success flex items-center gap-1">
                <Check className="h-4 w-4" />
                Convite enviado!
              </p>
            )}
          </div>

          {/* Rewards Tiers */}
          <div className="rounded-xl bg-card border border-border p-4">
            <h3 className="font-semibold text-foreground mb-4">Recompensas</h3>
            <div className="space-y-3">
              {rewards.map((tier, index) => {
                const isUnlocked = referredFriends.length >= tier.friends
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 rounded-lg p-3 ${
                      isUnlocked ? "bg-primary/10" : "bg-secondary"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isUnlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isUnlocked ? <Check className="h-5 w-5" /> : tier.friends}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{tier.description}</p>
                      <p className="text-sm text-muted-foreground">{tier.reward}</p>
                    </div>
                    {isUnlocked && (
                      <span className="text-xs font-medium text-primary">Desbloqueado!</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Referred Friends */}
          <div className="rounded-xl bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Amigos indicados</h3>
              <span className="text-sm text-muted-foreground">
                {referredFriends.length} amigos
              </span>
            </div>
            {referredFriends.length > 0 ? (
              <div className="space-y-3">
                {referredFriends.map((friend, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg bg-secondary p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Entrou em {new Date(friend.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-success">+100 XP</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum amigo indicado ainda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
