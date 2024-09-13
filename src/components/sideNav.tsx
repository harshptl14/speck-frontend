"use client";

import Link from "next/link";
import { Bell, Package2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { SideNavItem } from "@/types";
import { cn } from "@/lib/utils";
import { Icons } from "./icon";
import AppIcon from "./appIcon";
export interface SidebarNavProps {
  items: SideNavItem[];
}

export default function SideNav({ items }: SidebarNavProps) {
  const path = usePathname();
  return (
    <>
      <div className="hidden border-r bg-muted/40 md:block sticky top-0 h-screen">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <AppIcon className="h-9 w-9" />
              <span className="text-lg">Speck</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {items.map((item, index) => {
                const Icon = Icons[item.icon || "arrowRight"];
                return (
                  item.href && (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                        path === item.href
                          ? "bg-muted"
                          : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
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
          </div>
          <div className="mt-auto p-4">
            <Button size="sm" className="w-full">
              <Link href="/create">Create Roadmap</Link>
            </Button>
            {/* <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Create a new roadmap</CardTitle>
                <CardDescription>
                  Anything you want to learn or achieve? Create a roadmap to
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Create
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </>
  );
}
