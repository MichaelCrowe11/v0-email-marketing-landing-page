"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const ConfirmationDialog = AlertDialogPrimitive.Root

const ConfirmationDialogTrigger = AlertDialogPrimitive.Trigger

const ConfirmationDialogPortal = AlertDialogPrimitive.Portal

const ConfirmationDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in",
      className
    )}
    {...props}
    ref={ref}
  />
))
ConfirmationDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const ConfirmationDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ConfirmationDialogPortal>
    <ConfirmationDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 glass-card border border-border/50 p-6 shadow-lg duration-200 data-[state=open]:animate-scale-in sm:rounded-lg",
        className
      )}
      {...props}
    />
  </ConfirmationDialogPortal>
))
ConfirmationDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const ConfirmationDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
)
ConfirmationDialogHeader.displayName = "ConfirmationDialogHeader"

const ConfirmationDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
ConfirmationDialogFooter.displayName = "ConfirmationDialogFooter"

const ConfirmationDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
ConfirmationDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const ConfirmationDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ConfirmationDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const ConfirmationDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} asChild>
    <Button className={className} {...props} />
  </AlertDialogPrimitive.Action>
))
ConfirmationDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const ConfirmationDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} asChild>
    <Button variant="outline" className={cn("mt-2 sm:mt-0", className)} {...props} />
  </AlertDialogPrimitive.Cancel>
))
ConfirmationDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  ConfirmationDialog,
  ConfirmationDialogTrigger,
  ConfirmationDialogContent,
  ConfirmationDialogHeader,
  ConfirmationDialogFooter,
  ConfirmationDialogTitle,
  ConfirmationDialogDescription,
  ConfirmationDialogAction,
  ConfirmationDialogCancel,
}
