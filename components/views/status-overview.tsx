"use client"
import { motion } from "framer-motion"
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Plane,
  Home,
  Utensils,
  Camera,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Sample data for the status overview
const holidayStatus = {
  destination: "Barcelona, Spain",
  dates: {
    start: "2024-06-15",
    end: "2024-06-22",
  },
  daysLeft: 28,
  budget: {
    total: 3000,
    spent: 1660,
    remaining: 1340,
  },
  tasks: {
    total: 20,
    completed: 8,
    inProgress: 5,
    pending: 7,
  },
  expenses: {
    transportation: 530,
    accommodation: 800,
    food: 120,
    activities: 60,
    shopping: 150,
  },
  participants: [
    { name: "John Doe", avatar: "/diverse-group.png" },
    { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
    { name: "Alex Johnson", avatar: "/diverse-group-meeting.png" },
    { name: "Sarah Williams", avatar: "/diverse-group-meeting.png" },
  ],
  upcomingEvents: [
    {
      title: "Flight to Barcelona",
      date: "2024-06-15",
      time: "10:30 AM",
      icon: <Plane className="h-5 w-5" />,
      status: "confirmed",
    },
    {
      title: "Hotel Check-in",
      date: "2024-06-15",
      time: "3:00 PM",
      icon: <Home className="h-5 w-5" />,
      status: "confirmed",
    },
    {
      title: "Sagrada Familia Tour",
      date: "2024-06-16",
      time: "9:00 AM",
      icon: <Camera className="h-5 w-5" />,
      status: "pending",
    },
    {
      title: "Dinner Reservation",
      date: "2024-06-16",
      time: "8:00 PM",
      icon: <Utensils className="h-5 w-5" />,
      status: "pending",
    },
  ],
}

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

const statusIcons = {
  confirmed: <CheckCircle className="h-4 w-4 text-green-500" />,
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  cancelled: <XCircle className="h-4 w-4 text-red-500" />,
}

export function StatusOverview() {
  const taskCompletionPercentage = (holidayStatus.tasks.completed / holidayStatus.tasks.total) * 100
  const budgetUsedPercentage = (holidayStatus.budget.spent / holidayStatus.budget.total) * 100

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <h1 className="sm:text-2xl text-xl font-bold">Status Overview</h1>
        <Button onClick={() => window.dispatchEvent(new CustomEvent('changeView', { detail: 'calendar' }))}>
          <Calendar className="mr-2 h-4 w-4" /> View Calendar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Trip to {holidayStatus.destination}</CardTitle>
            <CardDescription className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              {holidayStatus.dates.start} to {holidayStatus.dates.end}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{holidayStatus.daysLeft} days left</div>
              <Badge variant="outline" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                {holidayStatus.participants.length} travelers
              </Badge>
            </div>
            <div className="mt-4 flex -space-x-2 flex-wrap">
              {holidayStatus.participants.map((participant, index) => (
                <Avatar key={index} className="border-2 border-background">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>
              ${holidayStatus.budget.spent.toFixed(2)} spent of ${holidayStatus.budget.total.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-sm">Spent</span>
                <span className="font-medium text-sm">{Math.round((holidayStatus.budget.spent / holidayStatus.budget.total) * 100)}%</span>
              </div>
              <Progress value={budgetUsedPercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>${holidayStatus.budget.spent.toFixed(2)}</span>
                <span className="text-green-600 dark:text-green-500">${holidayStatus.budget.remaining.toFixed(2)} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {holidayStatus.tasks.completed}/{holidayStatus.tasks.total}
            </div>
            <Progress value={taskCompletionPercentage} className="h-2" />
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Completed</span>
                <span className="font-medium">{holidayStatus.tasks.completed}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">In Progress</span>
                <span className="font-medium">{holidayStatus.tasks.inProgress}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Pending</span>
                <span className="font-medium">{holidayStatus.tasks.pending}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.entries(holidayStatus.expenses).map(([category, amount]) => (
                <div
                  key={category}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg p-2",
                    categoryColors[category as keyof typeof categoryColors]
                  )}
                >
                  <div className="flex items-center justify-center">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </div>
                  <span className="text-xs mt-1 capitalize">{category}</span>
                  <span className="font-medium">${amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holidayStatus.upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted">{event.icon}</div>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.date} · {event.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcons[event.status as keyof typeof statusIcons]}
                  <span className="text-sm capitalize">{event.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Events
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
