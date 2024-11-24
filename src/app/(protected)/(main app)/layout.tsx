import type { Metadata } from "next";
import SideNav from "@/components/sideNav";
import MainNav from "@/components/mainNav";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideNav
        items={[
          {
            href: "/home",
            icon: "home",
            title: "Home",
          },
          {
            href: "/library",
            icon: "library",
            title: "Library",
          },
          {
            href: "/templates",
            icon: "template",
            title: "Templates",
            badge: 6,
          },
        ]}
        key={0}
      />
      <div className="flex flex-col">
        <MainNav
          items={[
            {
              href: "/home",
              icon: "home",
              title: "Home",
            },
            {
              href: "/library",
              icon: "library",
              title: "Library",
            },
            {
              href: "/templates",
              icon: "template",
              title: "Templates",
              badge: 6,
            },
          ]}
          key={1}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
