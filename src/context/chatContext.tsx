// context/ChatContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  markdownBlocks?: { id: string; content: string }[];
  explanation?: string;
  plaintext?: string;
};

interface ChatContextType {
  getChat: (mindmapId: string) => Message[] | undefined;
  setChat: (mindmapId: string, messages: Message[]) => void;
  clearChat: (mindmapId: string) => void;
  syncMessages: (mindmapId: string, updater: (prev: Message[]) => Message[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatCache, setChatCache] = useState<Record<string, Message[]>>({});

  const getChat = (mindmapId: string) => chatCache[mindmapId];

  const setChat = (mindmapId: string, messages: Message[]) => {
    setChatCache((prev) => ({
      ...prev,
      [mindmapId]: messages,
    }));
  };

  const syncMessages = (mindmapId: string, updater: (prev: Message[]) => Message[]) => {
    setChatCache((prev) => {
      const updated = updater(prev[mindmapId] || []);
      return {
        ...prev,
        [mindmapId]: updated,
      };
    });
  };

  const clearChat = (mindmapId: string) => {
    setChatCache((prev) => {
      const newCache = { ...prev };
      delete newCache[mindmapId];
      return newCache;
    });
  };

  return (
    <ChatContext.Provider value={{ getChat, setChat, clearChat, syncMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export { ChatProvider, useChatContext };
