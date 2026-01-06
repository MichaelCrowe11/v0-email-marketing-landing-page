"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"

interface ConfirmationOptions {
  title: string
  description: string | ReactNode
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => void
  close: () => void
  state: {
    isOpen: boolean
    title: string
    description: string | ReactNode
    confirmText: string
    cancelText: string
    variant: "default" | "destructive"
    onConfirm: () => void | Promise<void>
    onCancel?: () => void
  }
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined)

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmationContextType["state"]>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
    onConfirm: () => {},
    onCancel: undefined,
  })

  const confirm = useCallback((options: ConfirmationOptions) => {
    setState({
      isOpen: true,
      title: options.title,
      description: options.description,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      variant: options.variant || "default",
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    })
  }, [])

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return (
    <ConfirmationContext.Provider value={{ confirm, close, state }}>
      {children}
    </ConfirmationContext.Provider>
  )
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error("useConfirmation must be used within a ConfirmationProvider")
  }
  return context
}
