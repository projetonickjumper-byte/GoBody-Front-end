"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Plus, Trash2, CheckCircle, Clock, XCircle, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/app-shell"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { billingService } from "@/lib/api/services/billing.service"

interface PaymentMethod {
  id: string
  type: "credit" | "debit" | "pix"
  brand?: string
  last4?: string
  expiry?: string
  isDefault: boolean
}

interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  status: "aprovado" | "pendente" | "recusado"
  method: string
}

const initialPaymentMethods: PaymentMethod[] = [
  { id: "1", type: "credit", brand: "Visa", last4: "4242", expiry: "12/28", isDefault: true },
  { id: "2", type: "credit", brand: "Mastercard", last4: "8888", expiry: "06/27", isDefault: false },
]

const transactions: Transaction[] = [
  { id: "1", description: "Day Use - PowerFit Academia", amount: 35.00, date: "2026-01-28", status: "aprovado", method: "Visa ****4242" },
  { id: "2", description: "Plano Mensal - Elite Fitness", amount: 129.90, date: "2026-01-15", status: "aprovado", method: "Visa ****4242" },
  { id: "3", description: "Aula Avulsa - Yoga Flow", amount: 45.00, date: "2026-01-10", status: "aprovado", method: "PIX" },
  { id: "4", description: "Day Use - CrossBox SP", amount: 50.00, date: "2026-01-05", status: "recusado", method: "Mastercard ****8888" },
]

const statusConfig = {
  aprovado: { label: "Aprovado", color: "bg-success text-success-foreground", icon: CheckCircle },
  pendente: { label: "Pendente", color: "bg-warning text-warning-foreground", icon: Clock },
  recusado: { label: "Recusado", color: "bg-destructive text-destructive-foreground", icon: XCircle },
}

export default function PagamentosPage() {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods)
  const [userTransactions, setUserTransactions] = useState(transactions)
  const [newCardOpen, setNewCardOpen] = useState(false)

  useEffect(() => {
    async function loadPaymentData() {
      try {
        const res = await billingService.getTransactions({})
        if (res.success && res.data && res.data.length > 0) {
          setUserTransactions(res.data as any)
        }
      } catch (error) {
        console.error("Erro ao carregar dados de pagamento:", error)
      }
    }
    loadPaymentData()
  }, [])

  const handleRemoveCard = (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    )
  }

  const handleAddCard = () => {
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: "credit",
      brand: "Visa",
      last4: "1234",
      expiry: "12/30",
      isDefault: paymentMethods.length === 0,
    }
    setPaymentMethods((prev) => [...prev, newCard])
    setNewCardOpen(false)
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
            <h1 className="text-xl font-bold">Pagamentos</h1>
          </div>
        </div>

        <div className="p-4 max-w-4xl mx-auto">
          <Tabs defaultValue="metodos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="metodos">Metodos de Pagamento</TabsTrigger>
              <TabsTrigger value="historico">Historico</TabsTrigger>
            </TabsList>

            <TabsContent value="metodos" className="space-y-4">
              {/* Payment Methods List */}
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center gap-4 rounded-xl bg-card border border-border p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {method.brand} ****{method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">Principal</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Expira em {method.expiry}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                          className="text-xs"
                        >
                          Definir como principal
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Cartao</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover este cartao? Esta acao nao pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveCard(method.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Card */}
              <Dialog open={newCardOpen} onOpenChange={setNewCardOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Cartao
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Cartao</DialogTitle>
                    <DialogDescription>
                      Adicione um novo cartao de credito ou debito
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Numero do Cartao</Label>
                      <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Validade</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome no Cartao</Label>
                      <Input id="name" placeholder="NOME COMPLETO" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewCardOpen(false)} className="bg-transparent">
                      Cancelar
                    </Button>
                    <Button onClick={handleAddCard}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </TabsContent>

            <TabsContent value="historico" className="space-y-4">
              {userTransactions.map((transaction) => {
                const status = statusConfig[transaction.status]
                const StatusIcon = status.icon
                return (
                  <div
                    key={transaction.id}
                    className="rounded-xl bg-card border border-border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Receipt className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.method}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          R$ {transaction.amount.toFixed(2).replace(".", ",")}
                        </p>
                        <Badge className={`${status.color} mt-1`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}

              {userTransactions.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma transacao encontrada</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
