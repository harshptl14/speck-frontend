"use client";

import Link from "next/link";

import { CircleUser, Menu, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavItem, SideNavItem } from "@/types";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "./icon";
import AppIcon from "./appIcon";

export interface NavProps {
  items: SideNavItem[];
}

export default function MainNav({ items }: NavProps) {
  const path = usePathname();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 backdrop-blur-xl">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <AppIcon className="h-9 w-9" />
              <span className="sr-only">Speck</span>
            </Link>
            {items.map((item, index) => {
              const Icon = Icons[item.icon || "arrowRight"];
              return (
                item.href && (
                  // <Link
                  //   href={item.href}
                  //   className={cn(
                  //     "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  //     path === item.href
                  //       ? "bg-muted"
                  //       : "text-muted-foreground"
                  //   )}
                  // >
                  //   <Icon className="h-4 w-4" />
                  //   <span>{item.title}</span>
                  //   {item?.badge && (
                  //     <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  //       {item?.badge}
                  //     </Badge>
                  //   )}
                  // </Link>
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                      path === item.href ? "bg-muted" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    {item?.badge && (
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        {item?.badge}
                      </Badge>
                    )}
                  </Link>
                )
              );
            })}
          </nav>
          <div className="mt-auto">
            {/* <Card>
              <CardHeader>
                <CardTitle>Create a new roadmap</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Create
                </Button>
              </CardContent>
            </Card> */}
            <Button size="sm" className="w-full">
              <Link href="/create">Create Roadmap</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <a href={process.env.NEXT_PUBLIC_API + "/speck/v1/auth/logout"}>
              Logout
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
