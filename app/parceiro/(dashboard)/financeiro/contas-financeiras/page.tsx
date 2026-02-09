"use client"

import { useState } from "react"
import { Landmark, Plus, Eye, EyeOff, ArrowUpRight, ArrowDownRight, MoreVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const mockAccounts = [
  { id: "1", name: "Conta Corrente Empresarial", bank: "Itau", type: "Corrente", balance: 45230.50, lastMovement: "2026-02-09", color: "from-orange-500 to-orange-600" },
  { id: "2", name: "Conta Poupanca", bank: "Bradesco", type: "Poupanca", balance: 12800.00, lastMovement: "2026-02-01", color: "from-emerald-500 to-emerald-600" },
  { id: "3", name: "Conta PIX Recebimentos", bank: "Nubank", type: "Digital", balance: 8540.20, lastMovement: "2026-02-09", color: "from-violet-500 to-violet-600" },
  { id: "4", name: "Caixa Fisico", bank: "Interno", type: "Caixa", balance: 1250.00, lastMovement: "2026-02-09", color: "from-blue-500 to-blue-600" },
]

export default function ContasFinanceirasPage() {
  const [showBalances, setShowBalances] = useState(true)

  const totalBalance = mockAccounts.reduce((a, b) => a + b.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contas Financeiras</h1>
          <p className="text-zinc-400 text-sm">Visao geral das suas contas bancarias</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-white" onClick={() => setShowBalances(!showBalances)}>
            {showBalances ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showBalances ? "Ocultar" : "Mostrar"}
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white"><Plus className="mr-2 h-4 w-4" /> Nova Conta</Button>
        </div>
      </div>

      {/* Total Card */}
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Saldo Total</p>
          <p className="text-3xl font-bold text-white mt-2">
            {showBalances ? `R$ ${totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "R$ ********"}
          </p>
          <p className="text-sm text-zinc-500 mt-1">{mockAccounts.length} contas cadastradas</p>
        </CardContent>
      </Card>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAccounts.map((account) => (
          <Card key={account.id} className="bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-200 group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${account.color} flex items-center justify-center shadow-lg`}>
                    <Landmark className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{account.name}</h3>
                    <p className="text-xs text-zinc-500">{account.bank} - {account.type}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Saldo disponivel</p>
                  <p className="text-xl font-bold text-white">
                    {showBalances ? `R$ ${account.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "R$ ********"}
                  </p>
                </div>
                <p className="text-xs text-zinc-600">Atualizado em {new Date(account.lastMovement).toLocaleDateString("pt-BR")}</p>
              </div>
              <Progress value={(account.balance / totalBalance) * 100} className="h-1.5 mt-4 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-orange-600" />
              <p className="text-xs text-zinc-600 mt-1">{((account.balance / totalBalance) * 100).toFixed(1)}% do total</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
