"use client"

import { useState, useEffect } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { KanbanBoard } from "@/components/views/kanban-board"
import { DayPlanner } from "@/components/views/day-planner"
import { TableView } from "@/components/views/table-view"
import { ExpenseTracker } from "@/components/views/expense-tracker"
import { StatusOverview } from "@/components/views/status-overview"
import { CalendarView } from "@/components/views/calendar-view"
import { KanbanSquare, Table, DollarSign, PieChart, User, Settings, LogOut, CalendarDays, Calendar, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

const views = [
  {
    id: "todo",
    label: "To Do",
    icon: <KanbanSquare className="text-primary h-5 w-5 flex-shrink-0" />,
    component: KanbanBoard,
  },
  {
    id: "dayplanner",
    label: "Day Planner",
    icon: <CalendarDays className="text-primary h-5 w-5 flex-shrink-0" />,
    component: DayPlanner,
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: <Calendar className="text-primary h-5 w-5 flex-shrink-0" />,
    component: CalendarView,
  },
  {
    id: "table",
    label: "Table View",
    icon: <Table className="text-primary h-5 w-5 flex-shrink-0" />,
    component: TableView,
  },
  {
    id: "expenses",
    label: "Expense Tracker",
    icon: <DollarSign className="text-primary h-5 w-5 flex-shrink-0" />,
    component: ExpenseTracker,
  },
  {
    id: "status",
    label: "Status Overview",
    icon: <PieChart className="text-primary h-5 w-5 flex-shrink-0" />,
    component: StatusOverview,
  },
]

const userLinks = [
  {
    label: "Profile",
    href: "#profile",
    icon: <User className="text-primary h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Settings",
    href: "#settings",
    icon: <Settings className="text-primary h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Logout",
    href: "#logout",
    icon: <LogOut className="text-primary h-5 w-5 flex-shrink-0" />,
  },
]

export function HolidayPlanner() {
  const [open, setOpen] = useState(false)
  const [activeView, setActiveView] = useState("todo")
  const isMobile = useIsMobile()

  // Initialize sidebar state based on screen size
  useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])
  
  // Listen for custom view change events
  useEffect(() => {
    const handleViewChangeEvent = (event: CustomEvent) => {
      setActiveView(event.detail)
    }
    
    window.addEventListener('changeView', handleViewChangeEvent as EventListener)
    
    return () => {
      window.removeEventListener('changeView', handleViewChangeEvent as EventListener)
    }
  }, [])

  const ActiveComponent = views.find((view) => view.id === activeView)?.component || KanbanBoard

  // Function to close sidebar on mobile when a view is selected
  const handleViewChange = (viewId: string) => {
    setActiveView(viewId)
    if (isMobile) {
      setOpen(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar with overlay for mobile */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 z-30" 
          onClick={() => setOpen(false)} 
          aria-hidden="true"
        />
      )}
      
      <Sidebar 
        open={open} 
        setOpen={setOpen}
        className={cn(
          isMobile && "fixed z-40 h-full", 
          !open && isMobile && "hidden"
        )}
      >
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex items-center justify-between">{open ? <Logo /> : <LogoIcon />}</div>
            <div className="mt-8 flex flex-col gap-2">
              {views.map((view) => (
                <SidebarLink
                  key={view.id}
                  link={{
                    label: view.label,
                    href: `#${view.id}`,
                    icon: view.icon,
                  }}
                  className={cn(activeView === view.id && "bg-muted/50 rounded-md font-medium")}
                  onClick={(e) => {
                    e.preventDefault()
                    handleViewChange(view.id)
                  }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {userLinks.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={link}
                onClick={(e) => {
                  e.preventDefault()
                  console.log(`Clicked on ${link.label}`)
                  if (isMobile) {
                    setOpen(false)
                  }
                }}
              />
            ))}
            <div className="flex items-center px-2 pt-2">
              <SidebarLink
                link={{
                  label: "John Doe",
                  href: "#profile",
                  icon: (
                    <Avatar className="h-7 w-7 flex-shrink-0">
                      <AvatarImage src="/diverse-group.png" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  ),
                }}
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 overflow-auto">
        <div className="flex justify-between items-center p-4">
          {/* Mobile menu button */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setOpen(!open)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          
          {/* Show active view title on mobile */}
          {isMobile && (
            <h1 className="text-lg font-semibold flex-1">
              {views.find(view => view.id === activeView)?.label || "Holiday Planner"}
            </h1>
          )}
          
          <ThemeToggle />
        </div>
        <div className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
      <div className="h-6 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-foreground whitespace-pre text-lg"
      >
        Holiday Planner
      </motion.span>
    </div>
  )
}

export const LogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
      <div className="h-6 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </div>
  )
}
