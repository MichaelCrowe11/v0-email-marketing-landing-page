"use client"

/**
 * UX Improvements Demo Component
 *
 * This component demonstrates all three UX improvements:
 * 1. Toast notifications
 * 2. Confirmation dialogs
 * 3. Loading states with feedback
 *
 * Use this as a reference for implementing these patterns in your own components.
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useConfirmation } from "@/hooks/use-confirmation"
import { toast } from "sonner"
import { Loader2, Trash2, Save, CheckCircle2, AlertCircle } from "lucide-react"

export function UXImprovementsDemo() {
  const { confirm } = useConfirmation()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [name, setName] = useState("")

  // Example 1: Form submission with toast notification and loading state
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required", {
        description: "Please enter a name before saving",
      })
      return
    }

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate success (90% of the time)
    const success = Math.random() > 0.1

    setIsSaving(false)

    if (success) {
      toast.success("Saved successfully!", {
        description: `"${name}" has been saved to your profile`,
        icon: <CheckCircle2 className="w-4 h-4" />,
      })
      setName("")
    } else {
      toast.error("Failed to save", {
        description: "There was an error saving your data. Please try again.",
        icon: <AlertCircle className="w-4 h-4" />,
      })
    }
  }

  // Example 2: Destructive action with confirmation dialog
  const handleDelete = () => {
    confirm({
      title: "Delete All Data?",
      description: (
        <div className="space-y-2">
          <p>This action cannot be undone. This will permanently delete:</p>
          <ul className="list-disc list-inside text-sm">
            <li>All your saved projects</li>
            <li>Your profile settings</li>
            <li>Your cultivation history</li>
          </ul>
        </div>
      ),
      confirmText: "Delete Everything",
      cancelText: "Keep My Data",
      variant: "destructive",
      onConfirm: async () => {
        setIsDeleting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setIsDeleting(false)

        toast.success("All data deleted", {
          description: "Your account has been reset",
        })
      },
      onCancel: () => {
        toast.info("Deletion cancelled", {
          description: "Your data is safe",
        })
      },
    })
  }

  // Example 3: Different toast types
  const showSuccessToast = () => {
    toast.success("Success!", {
      description: "This is a success message",
    })
  }

  const showErrorToast = () => {
    toast.error("Error!", {
      description: "This is an error message",
    })
  }

  const showInfoToast = () => {
    toast.info("Information", {
      description: "This is an informational message",
    })
  }

  const showWarningToast = () => {
    toast.warning("Warning!", {
      description: "This is a warning message",
    })
  }

  const showLoadingToast = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 3000)),
      {
        loading: "Processing your request...",
        success: "Request completed!",
        error: "Request failed",
      }
    )
  }

  const showActionToast = () => {
    toast.success("File uploaded", {
      description: "Document.pdf has been uploaded successfully",
      action: {
        label: "View",
        onClick: () => toast.info("Opening file..."),
      },
    })
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">UX Improvements Demo</h1>
        <p className="text-muted-foreground">
          Interactive examples of toast notifications, confirmation dialogs, and loading states
        </p>
      </div>

      {/* Example 1: Form with Loading State and Toast */}
      <Card>
        <CardHeader>
          <CardTitle>Example 1: Form with Loading Feedback</CardTitle>
          <CardDescription>
            Shows loading state on button and toast notification on success/error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Example 2: Destructive Action with Confirmation */}
      <Card>
        <CardHeader>
          <CardTitle>Example 2: Confirmation Dialog</CardTitle>
          <CardDescription>
            Destructive actions require user confirmation before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Example 3: Toast Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Example 3: Toast Notification Types</CardTitle>
          <CardDescription>
            Different toast variants for various feedback scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button onClick={showSuccessToast} variant="outline" size="sm">
            Success Toast
          </Button>
          <Button onClick={showErrorToast} variant="outline" size="sm">
            Error Toast
          </Button>
          <Button onClick={showInfoToast} variant="outline" size="sm">
            Info Toast
          </Button>
          <Button onClick={showWarningToast} variant="outline" size="sm">
            Warning Toast
          </Button>
          <Button onClick={showLoadingToast} variant="outline" size="sm">
            Loading Toast
          </Button>
          <Button onClick={showActionToast} variant="outline" size="sm">
            Action Toast
          </Button>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
          <CardDescription>
            View the complete documentation at UX_IMPROVEMENTS.md
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Toast Notifications</h3>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
              <code>{`import { toast } from "sonner"

toast.success("Operation successful!")
toast.error("Something went wrong")
toast.info("Did you know...")
toast.warning("Be careful!")`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Confirmation Dialog</h3>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
              <code>{`import { useConfirmation } from "@/hooks/use-confirmation"

const { confirm } = useConfirmation()

confirm({
  title: "Delete Item?",
  description: "This cannot be undone",
  variant: "destructive",
  onConfirm: async () => {
    await deleteItem()
    toast.success("Deleted!")
  }
})`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Loading State</h3>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
              <code>{`<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</Button>`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
