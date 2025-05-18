"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen, children, className }) => {
  const isMobile = useIsMobile()

  React.useEffect(() => {
    if (!isMobile) {
      setOpen(true)
    }
  }, [isMobile, setOpen])

  return (
    <motion.aside
      initial={{ width: open ? 240 : 70 }}
      animate={{ width: open ? 240 : 70 }}
      transition={{
        type: "spring",
        stiffness: isMobile ? 300 : 100,
        damping: isMobile ? 30 : 20,
        duration: isMobile ? 0.2 : 0.3,
      }}
      className={cn(
        "flex flex-col h-screen bg-secondary border-r border-muted transition-width",
        !open && "md:hover:w-60",
        className
      )}
    >
      {children}
    </motion.aside>
  )
}

interface SidebarBodyProps {
  children: React.ReactNode
  className?: string
}

export const SidebarBody: React.FC<SidebarBodyProps> = ({ children, className }) => {
  return <div className={cn("flex flex-col h-full p-3", className)}>{children}</div>
}

interface SidebarLinkProps {
  link: {
    label: string
    href: string
    icon?: React.ReactNode
  }
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ link, className, onClick }) => {
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center space-x-3 rounded-md p-2 text-sm font-medium hover:bg-[#f0f0ef] transition-colors dark:text-[#d4d4d4] dark:hover:text-white",
        className,
      )}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick(e)
        }
      }}
    >
      {link.icon}
      <span>{link.label}</span>
    </a>
  )
}
