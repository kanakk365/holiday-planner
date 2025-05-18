"use client"

import { useState, useEffect } from "react"
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar"
import { format } from "date-fns"

// Convert activities from day planner to calendar events
const convertActivitiesToCalendarEvents = (activities: any, days: any) => {
  const calendarData: any[] = []

  Object.keys(days).forEach((dayId) => {
    const day = days[dayId]
    if (day.date && day.activityIds.length > 0) {
      const events = day.activityIds.map((activityId: string, index: number) => {
        const activity = activities[activityId]
        return {
          id: index + 1,
          name: activity.content,
          time: activity.time,
          datetime: `${day.date}T${activity.time}`,
        }
      })

      calendarData.push({
        day: new Date(day.date),
        events,
      })
    }
  })

  return calendarData
}

// Sample data for the calendar
const sampleEvents = [
  {
    day: new Date(),
    events: [
      {
        id: 1,
        name: "Flight to Barcelona",
        time: "10:30 AM",
        datetime: format(new Date(), "yyyy-MM-dd") + "T10:30",
      },
      {
        id: 2,
        name: "Hotel Check-in",
        time: "3:00 PM",
        datetime: format(new Date(), "yyyy-MM-dd") + "T15:00",
      },
    ],
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() + 1)),
    events: [
      {
        id: 3,
        name: "Sagrada Familia Tour",
        time: "9:00 AM",
        datetime: format(new Date(new Date().setDate(new Date().getDate() + 1)), "yyyy-MM-dd") + "T09:00",
      },
    ],
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() + 2)),
    events: [
      {
        id: 4,
        name: "Beach Day",
        time: "11:00 AM",
        datetime: format(new Date(new Date().setDate(new Date().getDate() + 2)), "yyyy-MM-dd") + "T11:00",
      },
      {
        id: 5,
        name: "Dinner Reservation",
        time: "8:00 PM",
        datetime: format(new Date(new Date().setDate(new Date().getDate() + 2)), "yyyy-MM-dd") + "T20:00",
      },
    ],
  },
]

export function CalendarView() {
  const [calendarData, setCalendarData] = useState(sampleEvents)

  // In a real app, you would fetch the day planner data and convert it
  // For now, we'll just use the sample data
  useEffect(() => {
    // Example of how you would convert day planner data to calendar events
    // if you had access to the day planner state
    // const dayPlannerData = getDayPlannerData()
    // const convertedData = convertActivitiesToCalendarEvents(
    //   dayPlannerData.activities,
    //   dayPlannerData.days
    // )
    // setCalendarData(convertedData)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Holiday Calendar</h1>
      </div>

      <div className="border rounded-lg overflow-hidden bg-background">
        <FullScreenCalendar data={calendarData} />
      </div>
    </div>
  )
}
