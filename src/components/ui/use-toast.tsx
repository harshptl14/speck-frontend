"use client"

import type React from "react"

// Shadcn UI use-toast.ts
import { useEffect, useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Toast = Omit<ToasterToast, "id">

type ToastActionType = (props: Toast) => void

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  const dismiss = (toastId?: string) => {
    setToasts((toasts) => {
      if (toastId) {
        toasts.filter((toast) => toast.id !== toastId)
      }
      return [...toasts]
    })
  }

  const toast: ToastActionType = (props) => {
    const id = genId()

    const newToast = {
      ...props,
      id,
    }

    setToasts((toasts) => [...toasts, newToast].slice(-TOAST_LIMIT))

    const timeout = setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
      toastTimeouts.delete(id)
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(id, timeout)

    return id
  }

  useEffect(() => {
    return () => {
      toastTimeouts.forEach((timeout) => {
        clearTimeout(timeout)
      })
    }
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}
