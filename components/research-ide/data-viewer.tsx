"use client"
import { Database, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataViewerProps {
  fileName?: string
  onGenerateCode?: (code: string) => void
}

export function DataViewer({ fileName, onGenerateCode }: DataViewerProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Data Viewer</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {fileName ? `Viewing: ${fileName}` : "Select a dataset file to view and explore data"}
        </p>
        <p className="text-xs text-muted-foreground">Supports CSV, JSON, Excel, and database connections</p>
        {fileName && (
          <div className="mt-4">
            <Button
              onClick={() => {
                onGenerateCode?.(`# Analyzing ${fileName}
import pandas as pd
df = pd.read_csv('${fileName}')
print(df.head())`)
              }}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Generate Analysis Code
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
