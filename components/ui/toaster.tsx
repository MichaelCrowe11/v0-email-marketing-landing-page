"use client"

import { Toaster as Sonner } from "sonner"
import { useTheme } from "next-themes"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg backdrop-blur-md",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "group-[.toast]:bg-destructive/10 group-[.toast]:text-destructive group-[.toast]:border-destructive/20",
          success: "group-[.toast]:bg-primary/10 group-[.toast]:text-primary group-[.toast]:border-primary/20",
          warning: "group-[.toast]:bg-orange-500/10 group-[.toast]:text-orange-500 group-[.toast]:border-orange-500/20",
          info: "group-[.toast]:bg-blue-500/10 group-[.toast]:text-blue-500 group-[.toast]:border-blue-500/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
