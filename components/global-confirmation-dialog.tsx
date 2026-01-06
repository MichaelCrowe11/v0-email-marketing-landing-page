"use client"

import { useConfirmation } from "@/hooks/use-confirmation"
import {
  ConfirmationDialog,
  ConfirmationDialogContent,
  ConfirmationDialogHeader,
  ConfirmationDialogFooter,
  ConfirmationDialogTitle,
  ConfirmationDialogDescription,
  ConfirmationDialogAction,
  ConfirmationDialogCancel,
} from "@/components/ui/confirmation-dialog"
import { useState } from "react"

export function GlobalConfirmationDialog() {
  const { state, close } = useConfirmation()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await state.onConfirm()
      close()
    } catch (error) {
      console.error("Confirmation action failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    state.onCancel?.()
    close()
  }

  return (
    <ConfirmationDialog open={state.isOpen} onOpenChange={(open) => !open && close()}>
      <ConfirmationDialogContent>
        <ConfirmationDialogHeader>
          <ConfirmationDialogTitle>{state.title}</ConfirmationDialogTitle>
          <ConfirmationDialogDescription>{state.description}</ConfirmationDialogDescription>
        </ConfirmationDialogHeader>
        <ConfirmationDialogFooter>
          <ConfirmationDialogCancel onClick={handleCancel} disabled={isLoading}>
            {state.cancelText}
          </ConfirmationDialogCancel>
          <ConfirmationDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            variant={state.variant === "destructive" ? "destructive" : "default"}
          >
            {isLoading ? "Loading..." : state.confirmText}
          </ConfirmationDialogAction>
        </ConfirmationDialogFooter>
      </ConfirmationDialogContent>
    </ConfirmationDialog>
  )
}
