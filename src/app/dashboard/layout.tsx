"use client"

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Settings } from "lucide-react"
import { AppSidebar } from "../components/SideBar"
import { Button } from "@/components/ui/button"

const sidebarNavItems = [
  {
    title: "Platform",
    items: [
      { href: "/dashboard", title: "Playground", icon: Home },
      { href: "/dashboard/history", title: "History", icon: Home },
      { href: "/dashboard/starred", title: "Starred", icon: Home },
      { href: "/dashboard/settings", title: "Settings", icon: Settings },
    ],
  },
  {
    title: "Models",
    items: [{ href: "/dashboard/models", title: "Models", icon: Home }],
  },
  {
    title: "Documentation",
    items: [{ href: "/dashboard/docs", title: "Documentation", icon: Home }],
  },
  {
    title: "Settings",
    items: [
      {
        href: "/dashboard/account-settings",
        title: "Settings",
        icon: Settings,
      },
    ],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <header className=" border-b border-gray-200 flex h-16 items-center px-3 py-6">
            <div className="w-full flex items-center gap-3.5">
              <SidebarTrigger />
              {children}
            </div>
            <div className="flex items-center gap-3.5">
              <Button variant={"ghost"}>Logout</Button>
              <Button variant={"ghost"}>Logout</Button>
            </div>
          </header>
        </main>
      </SidebarProvider>
    </div>
  )
}
