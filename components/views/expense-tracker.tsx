"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Camera,
  Calendar,
  DollarSign,
  Home,
  Plus,
  ShoppingBag,
  Trash2,
  Utensils,
  Plane,
} from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

// Sample data for expenses
const initialExpenses = [
  {
    id: "exp-1",
    description: "Flight tickets",
    amount: 450,
    date: "2024-06-01",
    category: "transportation",
    paymentMethod: "credit card",
  },
  {
    id: "exp-2",
    description: "Hotel reservation",
    amount: 800,
    date: "2024-06-02",
    category: "accommodation",
    paymentMethod: "credit card",
  },
  {
    id: "exp-3",
    description: "Restaurant dinner",
    amount: 120,
    date: "2024-06-15",
    category: "food",
    paymentMethod: "cash",
  },
  {
    id: "exp-4",
    description: "Museum tickets",
    amount: 60,
    date: "2024-06-16",
    category: "activities",
    paymentMethod: "cash",
  },
  {
    id: "exp-5",
    description: "Souvenir shopping",
    amount: 150,
    date: "2024-06-17",
    category: "shopping",
    paymentMethod: "credit card",
  },
  {
    id: "exp-6",
    description: "Taxi rides",
    amount: 80,
    date: "2024-06-18",
    category: "transportation",
    paymentMethod: "cash",
  },
]

const categoryIcons = {
  transportation: <Plane className="h-4 w-4" />,
  accommodation: <Home className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  activities: <Camera className="h-4 w-4" />,
  shopping: <ShoppingBag className="h-4 w-4" />,
}

const categoryColors = {
  transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  accommodation: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  food: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  activities: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  shopping: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    paymentMethod: "",
  })

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      const category = expense.category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.date || !newExpense.category) {
      return
    }

    const expense = {
      id: `exp-${expenses.length + 1}`,
      description: newExpense.description,
      amount: Number.parseFloat(newExpense.amount),
      date: newExpense.date,
      category: newExpense.category,
      paymentMethod: newExpense.paymentMethod || "credit card",
    }

    setExpenses([...expenses, expense])
    setNewExpense({
      description: "",
      amount: "",
      date: "",
      category: "",
      paymentMethod: "",
    })
    setShowAddExpense(false)
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex  sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <h1 className="sm:text-2xl text-xl font-bold">Expense Tracker</h1>
        <Button onClick={() => setShowAddExpense(!showAddExpense)} className="  " >
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      {showAddExpense && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
              <CardDescription>Enter the details of your expense</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="What did you spend on?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="activities">Activities</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Method</Label>
                  <Select
                    value={newExpense.paymentMethod}
                    onValueChange={(value) => setNewExpense({ ...newExpense, paymentMethod: value })}
                  >
                    <SelectTrigger id="payment">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit card">Credit Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="debit card">Debit Card</SelectItem>
                      <SelectItem value="mobile payment">Mobile Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowAddExpense(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense}>Save Expense</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Biggest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.max(...expenses.map((e) => e.amount), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Number of Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`}>
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </div>
                    <span className="font-medium capitalize">{category}</span>
                  </div>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[200px] w-full">
              {/* Add a pie chart or visualization here */}
              <div className="flex flex-wrap gap-2 justify-center items-center h-full">
                {Object.entries(expensesByCategory).map(([category, amount]) => {
                  const percentage = Math.round((amount / totalExpenses) * 100)
                  return (
                    <div
                      key={category}
                      className="flex flex-col items-center"
                      style={{ flexBasis: `${Math.max(percentage, 10)}%` }}
                    >
                      <div
                        className={`w-full h-24 rounded-t-lg ${categoryColors[category as keyof typeof categoryColors]}`}
                        style={{ height: `${Math.max(percentage, 20)}px` }}
                      ></div>
                      <span className="text-xs mt-1 text-center capitalize">{category}</span>
                      <span className="text-xs font-medium">{percentage}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Payment Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${categoryColors[expense.category as keyof typeof categoryColors]}`}>
                          {categoryIcons[expense.category as keyof typeof categoryIcons]}
                        </div>
                        <span className="capitalize">{expense.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell capitalize">{expense.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {expenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No expenses recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
