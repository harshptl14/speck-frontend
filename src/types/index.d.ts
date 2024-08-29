import { Icon } from "lucide-react"
import { Icons } from "@/components/icon"
export type SideNavItem = {
    title: string
    href: string
    disabled?: boolean
    icon?: keyof typeof Icons
    badge?: number
}

export type NavItem = {
    title: string
    href: string
    disabled?: boolean
}