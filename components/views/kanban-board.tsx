"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Plus, MoreHorizontal, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Define types for our data structure
interface Task {
  id: string
  content: string
  date: string
  location: string
  priority: string
  assignee: {
    name: string
    avatar: string
  }
}

interface Column {
  id: string
  title: string
  taskIds: string[]
}

interface KanbanData {
  tasks: {
    [key: string]: Task
  }
  columns: {
    [key: string]: Column
  }
  columnOrder: string[]
}

// Sample data for the Kanban board
const initialData: KanbanData = {
  tasks: {
    "task-1": {
      id: "task-1",
      content: "Book flights to Barcelona",
      date: "2024-06-15",
      location: "Barcelona, Spain",
      priority: "high",
      assignee: { name: "John Doe", avatar: "/diverse-group.png" },
    },
    "task-2": {
      id: "task-2",
      content: "Reserve hotel accommodation",
      date: "2024-06-10",
      location: "Barcelona, Spain",
      priority: "medium",
      assignee: { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
    },
    "task-3": {
      id: "task-3",
      content: "Create itinerary for day trips",
      date: "2024-06-20",
      location: "Costa Brava",
      priority: "low",
      assignee: { name: "John Doe", avatar: "/diverse-group.png" },
    },
    "task-4": {
      id: "task-4",
      content: "Research local restaurants",
      date: "2024-06-12",
      location: "Barcelona, Spain",
      priority: "medium",
      assignee: { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
    },
    "task-5": {
      id: "task-5",
      content: "Exchange currency",
      date: "2024-06-08",
      location: "Local bank",
      priority: "high",
      assignee: { name: "John Doe", avatar: "/diverse-group.png" },
    },
    "task-6": {
      id: "task-6",
      content: "Pack luggage",
      date: "2024-06-14",
      location: "Home",
      priority: "high",
      assignee: { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-2", "task-3"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: ["task-4", "task-5"],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: ["task-6"],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const assignees = [
  { name: "John Doe", avatar: "/diverse-group.png" },
  { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
  { name: "Alex Johnson", avatar: "/diverse-group-meeting.png" },
]

export function KanbanBoard() {
  const [data, setData] = useState<KanbanData>(initialData)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    content: "",
    date: "",
    location: "",
    priority: "medium",
    assignee: assignees[0].name,
    column: "column-1", // Default to "To Do" column
  })
  const [currentTask, setCurrentTask] = useState<{
    id: string
    content: string
    date: string
    location: string
    priority: string
    assignee: string
    column: string
  } | null>(null)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or if the item was dropped back in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const sourceColumn = data.columns[source.droppableId]
    const destColumn = data.columns[destination.droppableId]

    // Moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newTaskIds = Array.from(sourceColumn.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      }

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      }

      setData(newData)
      return
    }

    // Moving from one column to another
    const sourceTaskIds = Array.from(sourceColumn.taskIds)
    sourceTaskIds.splice(source.index, 1)
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    }

    const destTaskIds = Array.from(destColumn.taskIds)
    destTaskIds.splice(destination.index, 0, draggableId)
    const newDestColumn = {
      ...destColumn,
      taskIds: destTaskIds,
    }

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      },
    }

    setData(newData)
  }

  const handleAddTask = () => {
    // Validate required fields
    if (!newTask.content) {
      alert("Please enter a task description")
      return
    }
    if (!newTask.date) {
      alert("Please enter a date")
      return
    }

    // Create new task
    const taskId = `task-${Date.now()}`
    const task = {
      id: taskId,
      content: newTask.content,
      date: newTask.date,
      location: newTask.location || "TBD",
      priority: newTask.priority,
      assignee: assignees.find((a) => a.name === newTask.assignee) || assignees[0],
    }

    // Add to selected column
    const column = data.columns[newTask.column]
    const newTaskIds = [...column.taskIds, taskId]

    // Update state
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: task,
      },
      columns: {
        ...data.columns,
        [newTask.column]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    })

    // Reset form and close dialog
    setNewTask({
      content: "",
      date: "",
      location: "",
      priority: "medium",
      assignee: assignees[0].name,
      column: "column-1",
    })
    setIsAddTaskOpen(false)
  }

  const openEditDialog = (taskId: string) => {
    const task = data.tasks[taskId]
    if (!task) return

    // Find which column contains this task
    let columnId = ""
    for (const colId of data.columnOrder) {
      if (data.columns[colId].taskIds.includes(taskId)) {
        columnId = colId
        break
      }
    }

    // First set the current task
    setCurrentTask({
      id: taskId,
      content: task.content,
      date: task.date,
      location: task.location,
      priority: task.priority,
      assignee: task.assignee.name,
      column: columnId,
    })

    // Then open the dialog after a short delay
    setTimeout(() => {
      setIsEditTaskOpen(true)
    }, 50)
  }

  const handleEditTask = () => {
    if (!currentTask) return

    // Validate required fields
    if (!currentTask.content) {
      alert("Please enter a task description")
      return
    }
    if (!currentTask.date) {
      alert("Please enter a date")
      return
    }

    // Find the column that contains the task
    let sourceColumnId = ""
    for (const columnId of data.columnOrder) {
      if (data.columns[columnId].taskIds.includes(currentTask.id)) {
        sourceColumnId = columnId
        break
      }
    }

    // If column has changed, move the task
    if (sourceColumnId && sourceColumnId !== currentTask.column) {
      // Remove from source column
      const sourceColumn = data.columns[sourceColumnId]
      const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== currentTask.id)

      // Add to destination column
      const destColumn = data.columns[currentTask.column]
      const newDestTaskIds = [...destColumn.taskIds, currentTask.id]

      // Update columns
      setData({
        ...data,
        tasks: {
          ...data.tasks,
          [currentTask.id]: {
            ...data.tasks[currentTask.id],
            content: currentTask.content,
            date: currentTask.date,
            location: currentTask.location,
            priority: currentTask.priority,
            assignee: assignees.find((a) => a.name === currentTask.assignee) || assignees[0],
          },
        },
        columns: {
          ...data.columns,
          [sourceColumnId]: {
            ...sourceColumn,
            taskIds: newSourceTaskIds,
          },
          [currentTask.column]: {
            ...destColumn,
            taskIds: newDestTaskIds,
          },
        },
      })
    } else {
      // Just update the task
      setData({
        ...data,
        tasks: {
          ...data.tasks,
          [currentTask.id]: {
            ...data.tasks[currentTask.id],
            content: currentTask.content,
            date: currentTask.date,
            location: currentTask.location,
            priority: currentTask.priority,
            assignee: assignees.find((a) => a.name === currentTask.assignee) || assignees[0],
          },
        },
      })
    }

    // Reset and close dialog
    setCurrentTask(null)
    setIsEditTaskOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    // Find the column that contains the task
    let columnId = ""
    for (const colId of data.columnOrder) {
      if (data.columns[colId].taskIds.includes(taskId)) {
        columnId = colId
        break
      }
    }

    if (!columnId) return

    // Remove task from column
    const column = data.columns[columnId]
    const newTaskIds = column.taskIds.filter((id) => id !== taskId)

    // Create new tasks object without the deleted task
    const newTasks = { ...data.tasks }
    delete newTasks[taskId]

    // Update state
    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Holiday To Do List</h1>
        <Button
          onClick={() => {
            setNewTask({
              content: "",
              date: "",
              location: "",
              priority: "medium",
              assignee: assignees[0].name,
              column: "column-1",
            })
            setIsAddTaskOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Create a new task for your holiday planning.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-content" className="text-right">
                Task
              </Label>
              <Input
                id="task-content"
                value={newTask.content}
                onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-date" className="text-right">
                Date
              </Label>
              <Input
                id="task-date"
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-location" className="text-right">
                Location
              </Label>
              <Input
                id="task-location"
                value={newTask.location}
                onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-priority" className="text-right">
                Priority
              </Label>
              <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-assignee" className="text-right">
                Assignee
              </Label>
              <Select value={newTask.assignee} onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((assignee) => (
                    <SelectItem key={assignee.name} value={assignee.name}>
                      {assignee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-column" className="text-right">
                Status
              </Label>
              <Select value={newTask.column} onValueChange={(value) => setNewTask({ ...newTask, column: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {data.columnOrder.map((columnId) => (
                    <SelectItem key={columnId} value={columnId}>
                      {data.columns[columnId].title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      {isEditTaskOpen && (
        <Dialog
          open={isEditTaskOpen}
          onOpenChange={(open) => {
            if (!open) {
              // First close the dialog
              setIsEditTaskOpen(false)
              // Then reset the current task state after a delay
              setTimeout(() => {
                setCurrentTask(null)
              }, 200)
            }
          }}
        >
          <DialogContent
            className="sm:max-w-[425px]"
            onInteractOutside={() => {
              setIsEditTaskOpen(false)
              setTimeout(() => {
                setCurrentTask(null)
              }, 200)
            }}
            onEscapeKeyDown={() => {
              setIsEditTaskOpen(false)
              setTimeout(() => {
                setCurrentTask(null)
              }, 200)
            }}
          >
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the details of your task.</DialogDescription>
            </DialogHeader>
            {currentTask && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-content" className="text-right">
                    Task
                  </Label>
                  <Input
                    id="edit-task-content"
                    value={currentTask.content}
                    onChange={(e) => setCurrentTask({ ...currentTask, content: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="edit-task-date"
                    type="date"
                    value={currentTask.date}
                    onChange={(e) => setCurrentTask({ ...currentTask, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="edit-task-location"
                    value={currentTask.location}
                    onChange={(e) => setCurrentTask({ ...currentTask, location: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={currentTask.priority}
                    onValueChange={(value) => setCurrentTask({ ...currentTask, priority: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-assignee" className="text-right">
                    Assignee
                  </Label>
                  <Select
                    value={currentTask.assignee}
                    onValueChange={(value) => setCurrentTask({ ...currentTask, assignee: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee.name} value={assignee.name}>
                          {assignee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-column" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={currentTask.column}
                    onValueChange={(value) => setCurrentTask({ ...currentTask, column: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.columnOrder.map((columnId) => (
                        <SelectItem key={columnId} value={columnId}>
                          {data.columns[columnId].title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditTaskOpen(false)
                  setTimeout(() => {
                    setCurrentTask(null)
                  }, 200)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleEditTask()
                  setTimeout(() => {
                    setCurrentTask(null)
                  }, 200)
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId]
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId])

            return (
              <div key={column.id} className="flex flex-col">
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">{column.title}</h2>
                  <Badge variant="outline">{tasks.length}</Badge>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "p-2 rounded-lg min-h-[500px] flex-1",
                        snapshot.isDraggingOver ? "bg-muted/80" : "bg-muted/40",
                      )}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3"
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card
                                  className={cn(
                                    "shadow-sm transition-all duration-200",
                                    snapshot.isDragging && "shadow-md rotate-2",
                                  )}
                                >
                                  <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start">
                                    <CardTitle className="text-base font-medium">{task.content}</CardTitle>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openEditDialog(task.id)}>
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </CardHeader>
                                  <CardContent className="p-3 pt-2">
                                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                                      <Calendar className="mr-2 h-4 w-4" />
                                      {task.date}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <MapPin className="mr-2 h-4 w-4" />
                                      {task.location}
                                    </div>
                                  </CardContent>
                                  <CardFooter className="p-3 pt-0 flex justify-between">
                                    <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                                      {task.priority}
                                    </Badge>
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={task.assignee.avatar || "/placeholder.svg"}
                                        alt={task.assignee.name}
                                      />
                                      <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  </CardFooter>
                                </Card>
                              </motion.div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
