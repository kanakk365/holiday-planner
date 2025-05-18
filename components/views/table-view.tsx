"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, ArrowUpDown, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Sample data for the table view
const holidayTasks = [
  {
    id: "task-1",
    task: "Book flights to Barcelona",
    date: "2024-06-15",
    location: "Barcelona, Spain",
    priority: "high",
    status: "To Do",
    assignee: { name: "John Doe", avatar: "/diverse-group.png" },
  },
  {
    id: "task-2",
    task: "Reserve hotel accommodation",
    date: "2024-06-10",
    location: "Barcelona, Spain",
    priority: "medium",
    status: "To Do",
    assignee: { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
  },
  {
    id: "task-3",
    task: "Create itinerary for day trips",
    date: "2024-06-20",
    location: "Costa Brava",
    priority: "low",
    status: "To Do",
    assignee: { name: "John Doe", avatar: "/diverse-group.png" },
  },
  {
    id: "task-4",
    task: "Research local restaurants",
    date: "2024-06-12",
    location: "Barcelona, Spain",
    priority: "medium",
    status: "In Progress",
    assignee: { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
  },
  {
    id: "task-5",
    task: "Exchange currency",
    date: "2024-06-08",
    location: "Local bank",
    priority: "high",
    status: "In Progress",
    assignee: { name: "John Doe", avatar: "/diverse-group.png" },
  },
  {
    id: "task-6",
    task: "Pack luggage",
    date: "2024-06-14",
    location: "Home",
    priority: "high",
    status: "Done",
    assignee: { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
  },
]

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusColors = {
  "To Do": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  "In Progress": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

export function TableView() {
  const [tasks, setTasks] = useState(holidayTasks)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const filteredTasks = tasks
    .filter(
      (task) =>
        task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((task) => statusFilter === "all" || task.status === statusFilter)

  const sortedTasks = React.useMemo(() => {
    const sortableTasks = [...filteredTasks]
    if (sortConfig !== null) {
      sortableTasks.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableTasks
  }, [filteredTasks, sortConfig])

  return (
    <div className="space-y-4">
      <div className="flex  sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <h1 className="text-2xl font-bold">Holiday Tasks</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Responsive table - scrollable horizontally on mobile */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] min-w-[150px]">
                <Button variant="ghost" onClick={() => requestSort("task")} className="flex items-center">
                  Task
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="min-w-[100px]">
                <Button variant="ghost" onClick={() => requestSort("date")} className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="min-w-[100px]">
                <Button variant="ghost" onClick={() => requestSort("priority")} className="flex items-center">
                  Priority
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="min-w-[100px]">
                <Button variant="ghost" onClick={() => requestSort("status")} className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Assignee</TableHead>
              <TableHead className="text-right min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task, index) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-muted/50"
              >
                <TableCell className="font-medium">{task.task}</TableCell>
                <TableCell>{task.date}</TableCell>
                <TableCell className="hidden md:table-cell">{task.location}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("whitespace-nowrap", priorityColors[task.priority as keyof typeof priorityColors])}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("whitespace-nowrap", statusColors[task.status as keyof typeof statusColors])}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm hidden lg:inline">{task.assignee.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Copy ID</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
            {sortedTasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No tasks found. Try adjusting your search or filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
