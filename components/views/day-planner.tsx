"use client"

// Define types for our data structure
import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Calendar, Edit, Edit2, MapPin, Plus, PlusCircle, Trash2, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Activity {
  id: string
  content: string
  time: string
  location: string
  duration: string
  type: string
  assignees: {
    name: string
    avatar: string
  }[]
}

interface Day {
  id: string
  date: string
  title: string
  activityIds: string[]
}

interface DayPlannerData {
  activities: {
    [key: string]: Activity
  }
  days: {
    [key: string]: Day
  }
  dayOrder: string[]
}

// Sample data for the Day Planner
const initialData: DayPlannerData = {
  activities: {
    "activity-1": {
      id: "activity-1",
      content: "Breakfast at hotel",
      time: "08:00",
      location: "Hotel Restaurant",
      duration: "1 hour",
      type: "food",
      assignees: [{ name: "John Doe", avatar: "/diverse-group.png" }],
    },
    "activity-2": {
      id: "activity-2",
      content: "Visit Sagrada Familia",
      time: "10:00",
      location: "Sagrada Familia, Barcelona",
      duration: "2 hours",
      type: "sightseeing",
      assignees: [
        { name: "John Doe", avatar: "/diverse-group.png" },
        { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
      ],
    },
    "activity-3": {
      id: "activity-3",
      content: "Lunch at local restaurant",
      time: "13:00",
      location: "La Rambla",
      duration: "1.5 hours",
      type: "food",
      assignees: [
        { name: "John Doe", avatar: "/diverse-group.png" },
        { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
      ],
    },
    "activity-4": {
      id: "activity-4",
      content: "Park Güell tour",
      time: "15:00",
      location: "Park Güell",
      duration: "2 hours",
      type: "sightseeing",
      assignees: [
        { name: "John Doe", avatar: "/diverse-group.png" },
        { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
      ],
    },
    "activity-5": {
      id: "activity-5",
      content: "Beach time",
      time: "17:30",
      location: "Barceloneta Beach",
      duration: "2 hours",
      type: "leisure",
      assignees: [{ name: "Jane Smith", avatar: "/diverse-group-conversation.png" }],
    },
    "activity-6": {
      id: "activity-6",
      content: "Dinner at seafood restaurant",
      time: "20:00",
      location: "Port Olimpic",
      duration: "2 hours",
      type: "food",
      assignees: [
        { name: "John Doe", avatar: "/diverse-group.png" },
        { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
      ],
    },
    "activity-7": {
      id: "activity-7",
      content: "Morning run",
      time: "07:00",
      location: "Beach promenade",
      duration: "1 hour",
      type: "exercise",
      assignees: [{ name: "John Doe", avatar: "/diverse-group.png" }],
    },
    "activity-8": {
      id: "activity-8",
      content: "Shopping at local market",
      time: "11:00",
      location: "Boqueria Market",
      duration: "1.5 hours",
      type: "shopping",
      assignees: [{ name: "Jane Smith", avatar: "/diverse-group-conversation.png" }],
    },
    "activity-9": {
      id: "activity-9",
      content: "Visit Barcelona Cathedral",
      time: "14:00",
      location: "Gothic Quarter",
      duration: "1 hour",
      type: "sightseeing",
      assignees: [
        { name: "John Doe", avatar: "/diverse-group.png" },
        { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
      ],
    },
  },
  days: {
    "day-1": {
      id: "day-1",
      date: "2024-06-15",
      title: "Day 1",
      activityIds: ["activity-1", "activity-2", "activity-3"],
    },
    "day-2": {
      id: "day-2",
      date: "2024-06-16",
      title: "Day 2",
      activityIds: ["activity-4", "activity-5", "activity-6"],
    },
    "day-3": {
      id: "day-3",
      date: "2024-06-17",
      title: "Day 3",
      activityIds: ["activity-7", "activity-8", "activity-9"],
    },
    unassigned: {
      id: "unassigned",
      date: "",
      title: "Unassigned Activities",
      activityIds: [],
    },
  },
  dayOrder: ["day-1", "day-2", "day-3", "unassigned"],
}

const activityTypeColors = {
  food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  sightseeing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  leisure: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  exercise: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  transportation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

// List of assignees for dropdown
const assigneesList = [
  { name: "John Doe", avatar: "/diverse-group.png" },
  { name: "Jane Smith", avatar: "/diverse-group-conversation.png" },
  { name: "Alex Johnson", avatar: "/diverse-group-meeting.png" },
]

export function DayPlanner() {
  const [data, setData] = useState<DayPlannerData>(initialData)
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [isEditActivityOpen, setIsEditActivityOpen] = useState(false)
  const [newActivity, setNewActivity] = useState({
    content: "",
    time: "",
    location: "",
    duration: "",
    type: "sightseeing",
    day: "",
  })
  const [currentActivity, setCurrentActivity] = useState<{
    id: string
    content: string
    time: string
    location: string
    duration: string
    type: string
    assignees: string[]
    dayId: string
  } | null>(null)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or if the item was dropped back in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const sourceDay = data.days[source.droppableId]
    const destDay = data.days[destination.droppableId]

    // Moving within the same day
    if (sourceDay.id === destDay.id) {
      const newActivityIds = Array.from(sourceDay.activityIds)
      newActivityIds.splice(source.index, 1)
      newActivityIds.splice(destination.index, 0, draggableId)

      const newDay = {
        ...sourceDay,
        activityIds: newActivityIds,
      }

      const newData = {
        ...data,
        days: {
          ...data.days,
          [newDay.id]: newDay,
        },
      }

      setData(newData)
      return
    }

    // Moving from one day to another
    const sourceActivityIds = Array.from(sourceDay.activityIds)
    sourceActivityIds.splice(source.index, 1)
    const newSourceDay = {
      ...sourceDay,
      activityIds: sourceActivityIds,
    }

    const destActivityIds = Array.from(destDay.activityIds)
    destActivityIds.splice(destination.index, 0, draggableId)
    const newDestDay = {
      ...destDay,
      activityIds: destActivityIds,
    }

    const newData = {
      ...data,
      days: {
        ...data.days,
        [newSourceDay.id]: newSourceDay,
        [newDestDay.id]: newDestDay,
      },
    }

    setData(newData)
  };

  const handleAddActivity = () => {
    // Validate required fields
    if (!newActivity.content) {
      alert("Please enter an activity name")
      return
    }
    if (!newActivity.time) {
      alert("Please enter a time")
      return
    }
    if (!newActivity.day) {
      alert("Please select a day")
      return
    }

    // Create new activity
    const activityId = `activity-${Date.now()}`
    const activity = {
      id: activityId,
      content: newActivity.content,
      time: newActivity.time,
      location: newActivity.location || "TBD",
      duration: newActivity.duration || "1 hour",
      type: newActivity.type,
      assignees: [{ name: "John Doe", avatar: "/diverse-group.png" }],
    }

    // Add to selected day
    const day = data.days[newActivity.day]
    const newActivityIds = [...day.activityIds, activityId]

    // Update state
    setData({
      ...data,
      activities: {
        ...data.activities,
        [activityId]: activity,
      },
      days: {
        ...data.days,
        [newActivity.day]: {
          ...day,
          activityIds: newActivityIds,
        },
      },
    })

    // Reset form and close dialog
    setNewActivity({
      content: "",
      time: "",
      location: "",
      duration: "",
      type: "sightseeing",
      day: "",
    })
    setIsAddActivityOpen(false)
  }

  const openEditDialog = (activityId: string, dayId: string) => {
    const activity = data.activities[activityId]
    if (!activity) return

    // First set the current activity
    setCurrentActivity({
      id: activityId,
      content: activity.content,
      time: activity.time,
      location: activity.location,
      duration: activity.duration,
      type: activity.type,
      assignees: activity.assignees.map((a) => a.name),
      dayId: dayId,
    })

    // Then open the dialog
    setTimeout(() => {
      setIsEditActivityOpen(true)
    }, 50)
  }

  const handleEditActivity = () => {
    if (!currentActivity) return

    // Validate required fields
    if (!currentActivity.content) {
      alert("Please enter an activity name")
      return
    }
    if (!currentActivity.time) {
      alert("Please enter a time")
      return
    }

    // Find the assignee objects based on names
    const updatedAssignees = currentActivity.assignees.map((name) => {
      const assignee = assigneesList.find((a) => a.name === name)
      return assignee || { name, avatar: "/placeholder.svg" }
    })

    // Update the activity
    const updatedActivity = {
      ...data.activities[currentActivity.id],
      content: currentActivity.content,
      time: currentActivity.time,
      location: currentActivity.location,
      duration: currentActivity.duration,
      type: currentActivity.type,
      assignees: updatedAssignees,
    }

    const oldDayId = currentActivity.dayId;
    const newDayId = currentActivity.dayId;
    const hasChangedDay = oldDayId !== newDayId;

    if (hasChangedDay) {
      // Handle moving activity between days
      setData(prev => {
        // Remove from old day
        const oldDay = prev.days[oldDayId];
        const newOldDayActivityIds = oldDay.activityIds.filter(id => id !== currentActivity.id);
        
        // Add to new day
        const newDay = prev.days[newDayId];
        const newDayActivityIds = [...newDay.activityIds, currentActivity.id];
        
        return {
          ...prev,
          activities: {
            ...prev.activities,
            [currentActivity.id]: updatedActivity,
          },
          days: {
            ...prev.days,
            [oldDayId]: {
              ...oldDay,
              activityIds: newOldDayActivityIds
            },
            [newDayId]: {
              ...newDay,
              activityIds: newDayActivityIds
            }
          }
        };
      });
    } else {
      // Just update the activity, no day change
      setData({
        ...data,
        activities: {
          ...data.activities,
          [currentActivity.id]: updatedActivity,
        },
      });
    }

    // Reset and close dialog
    setCurrentActivity(null)
    setIsEditActivityOpen(false)
  }

  const handleDeleteActivity = (activityId: string, dayId: string) => {
    const day = data.days[dayId]
    const newActivityIds = day.activityIds.filter((id) => id !== activityId)

    const newActivities = { ...data.activities }
    delete newActivities[activityId]

    setData({
      ...data,
      activities: newActivities,
      days: {
        ...data.days,
        [dayId]: {
          ...day,
          activityIds: newActivityIds,
        },
      },
    })
  }

  const addNewDay = () => {
    const newDayId = `day-${Object.keys(data.days).length}`
    const newDay = {
      id: newDayId,
      date: "",
      title: `Day ${Object.keys(data.days).length}`,
      activityIds: [],
    }

    const newDayOrder = [...data.dayOrder]
    // Insert before the unassigned section
    newDayOrder.splice(newDayOrder.length - 1, 0, newDayId)

    setData({
      ...data,
      days: {
        ...data.days,
        [newDayId]: newDay,
      },
      dayOrder: newDayOrder,
    })
  }

  const handleDeleteDay = (dayId: string) => {
    // Don't allow deleting the unassigned section
    if (dayId === "unassigned") return
    
    // Move all activities from this day to the unassigned section
    const dayToDelete = data.days[dayId]
    const unassignedDay = data.days["unassigned"]
    
    // Update unassigned activities
    const updatedUnassignedActivityIds = [...unassignedDay.activityIds, ...dayToDelete.activityIds]
    
    // Create new days object without the deleted day
    const newDays = { ...data.days }
    delete newDays[dayId]
    
    // Update unassigned section with the moved activities
    newDays["unassigned"] = {
      ...unassignedDay,
      activityIds: updatedUnassignedActivityIds,
    }
    
    // Update the day order to remove the deleted day
    const newDayOrder = data.dayOrder.filter(id => id !== dayId)
    
    // Update state
    setData({
      ...data,
      days: newDays,
      dayOrder: newDayOrder,
    })
  }

  // Sort activities by time for each day
  const sortActivitiesByTime = (activityIds: string[]) => {
    return [...activityIds].sort((a, b) => {
      const timeA = data.activities[a].time
      const timeB = data.activities[b].time
      return timeA.localeCompare(timeB)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <h1 className="text-2xl font-bold">Day-by-Day Planner</h1>
        <div className="flex sm:gap-2 gap-20 ">
          <Button
            onClick={() => {
              // Reset form and open dialog
              setNewActivity({
                content: "",
                time: "",
                location: "",
                duration: "",
                type: "sightseeing",
                day: data.dayOrder[0], // Default to first day
              })
              setIsAddActivityOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Activity
          </Button>

          <Button variant="outline" className="p-2" onClick={addNewDay}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Day
          </Button>
        </div>
      </div>

      {/* Dialog for adding new activity */}
      <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>Create a new activity for your trip itinerary.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activity-name" className="text-right">
                Activity
              </Label>
              <Input
                id="activity-name"
                value={newActivity.content}
                onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activity-time" className="text-right">
                Time
              </Label>
              <Input
                id="activity-time"
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activity-location" className="text-right">
                Location
              </Label>
              <Input
                id="activity-location"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activity-duration" className="text-right">
                Duration
              </Label>
              <Input
                id="activity-duration"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                placeholder="e.g. 1 hour"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activity-type" className="text-right">
                Type
              </Label>
              <Select
                value={newActivity.type}
                onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="sightseeing">Sightseeing</SelectItem>
                  <SelectItem value="leisure">Leisure</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activity-day" className="text-right">
                Day
              </Label>
              <Select
                value={newActivity.day}
                onValueChange={(value) => setNewActivity({ ...newActivity, day: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {data.dayOrder.map((dayId) => (
                    <SelectItem key={dayId} value={dayId}>
                      {data.days[dayId].title} {data.days[dayId].date && `(${data.days[dayId].date})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddActivity}>Add Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing activity */}
      {isEditActivityOpen && (
        <Dialog
          open={isEditActivityOpen}
          onOpenChange={(open) => {
            if (!open) {
              // First close the dialog
              setIsEditActivityOpen(false)
              // Then reset the current activity state after a delay
              setTimeout(() => {
                setCurrentActivity(null)
              }, 200)
            }
          }}
        >
          <DialogContent
            className="sm:max-w-[425px]"
            onInteractOutside={() => {
              setIsEditActivityOpen(false)
              setTimeout(() => {
                setCurrentActivity(null)
              }, 200)
            }}
            onEscapeKeyDown={() => {
              setIsEditActivityOpen(false)
              setTimeout(() => {
                setCurrentActivity(null)
              }, 200)
            }}
          >
            <DialogHeader>
              <DialogTitle>Edit Activity</DialogTitle>
              <DialogDescription>Update the details of your activity.</DialogDescription>
            </DialogHeader>
            {currentActivity && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-activity-name" className="text-right">
                    Activity
                  </Label>
                  <Input
                    id="edit-activity-name"
                    value={currentActivity.content}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, content: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-activity-time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="edit-activity-time"
                    type="time"
                    value={currentActivity.time}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, time: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-activity-location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="edit-activity-location"
                    value={currentActivity.location}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, location: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-activity-duration" className="text-right">
                    Duration
                  </Label>
                  <Input
                    id="edit-activity-duration"
                    value={currentActivity.duration}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, duration: e.target.value })}
                    placeholder="e.g. 1 hour"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-activity-type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={currentActivity.type}
                    onValueChange={(value) => setCurrentActivity({ ...currentActivity, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="sightseeing">Sightseeing</SelectItem>
                      <SelectItem value="leisure">Leisure</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-activity-day" className="text-right">
                    Day
                  </Label>
                  <Select
                    value={currentActivity.dayId}
                    onValueChange={(value) => setCurrentActivity({ ...currentActivity, dayId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.dayOrder.map((dayId) => (
                        <SelectItem key={dayId} value={dayId}>
                          {data.days[dayId].title} {data.days[dayId].date && `(${data.days[dayId].date})`}
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
                  setIsEditActivityOpen(false)
                  setTimeout(() => {
                    setCurrentActivity(null)
                  }, 200)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleEditActivity()
                  setTimeout(() => {
                    setCurrentActivity(null)
                  }, 200)
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.dayOrder.map((dayId) => {
              const day = data.days[dayId]
              const sortedActivityIds = sortActivitiesByTime(day.activityIds)

              return (
                <div key={day.id}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{day.title}</CardTitle>
                          {day.date && <CardDescription>{day.date}</CardDescription>}
                        </div>
                        {day.id !== "unassigned" && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDay(day.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId={day.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                              "p-2 rounded-lg min-h-[200px] flex-1",
                              snapshot.isDraggingOver ? "bg-muted/80" : "bg-muted/40"
                            )}
                          >
                            {sortedActivityIds.length === 0 ? (
                              <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                                <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  {day.id === "unassigned"
                                    ? "Drag activities here that are not assigned to a specific day"
                                    : "No activities scheduled for this day yet"}
                                </p>
                                {day.id !== "unassigned" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => {
                                      setNewActivity({
                                        content: "",
                                        time: "",
                                        location: "",
                                        duration: "",
                                        type: "sightseeing",
                                        day: day.id,
                                      })
                                      setIsAddActivityOpen(true)
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-1" /> Add Activity
                                  </Button>
                                )}
                              </div>
                            ) : (
                              sortedActivityIds.map((activityId, index) => {
                                const activity = data.activities[activityId];
                                return (
                                  <ActivityItem
                                    key={activityId}
                                    activity={activity}
                                    index={index}
                                    dayId={day.id}
                                    openEditDialog={openEditDialog}
                                    handleDeleteActivity={handleDeleteActivity}
                                  />
                                );
                              })
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}

// Activity item component for drag and drop
function ActivityItem({ activity, index, dayId, openEditDialog, handleDeleteActivity }) {
  return (
    <Draggable draggableId={activity.id} index={index}>
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
              <CardContent className="p-3">
                {/* Activity header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-sm mb-1">{activity.content}</h3>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                        {activity.duration && ` · ${activity.duration}`}
                      </div>
                      {activity.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {activity.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full"
                      >
                        <MoreVertical className="h-3 w-3" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => openEditDialog(activity.id, dayId)}>
                        <Edit className="h-3 w-3 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteActivity(activity.id, dayId)} className="text-red-600">
                        <Trash2 className="h-3 w-3 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Activity footer */}
                <div className="flex justify-between items-center mt-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      activityTypeColors[activity.type]
                    )}
                  >
                    {activity.type}
                  </Badge>
                  <div className="flex -space-x-2">
                    {activity.assignees.map((assignee, index) => (
                      <Avatar key={index} className="h-5 w-5 border-background border">
                        <AvatarImage src={assignee.avatar} alt={assignee.name} />
                        <AvatarFallback className="text-[10px]">
                          {assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
