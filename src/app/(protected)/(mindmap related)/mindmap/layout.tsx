import React from "react";
import { ChatProvider } from "@/context/chatContext";

export default function CourseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <ChatProvider>
      <main>{children}</main>
    </ChatProvider>
  );
}
