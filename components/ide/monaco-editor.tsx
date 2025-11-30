"use client"

import { useState } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import { Loader2 } from "lucide-react"

export function MonacoEditor() {
  const [isEditorReady, setIsEditorReady] = useState(false)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setIsEditorReady(true)
    // Configure editor settings
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      wordWrap: "on",
      scrollBeyondLastLine: false,
      automaticLayout: true,
    })
  }

  return (
    <div className="relative h-full w-full bg-[#1e1e1e]">
      {!isEditorReady && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <Editor
        height="100%"
        defaultLanguage="python"
        defaultValue="# Welcome to the Biotech IDE
# Start coding your bioinformatics pipeline here

import numpy as np
import pandas as pd

def analyze_sequence(sequence):
    '''
    Analyze a DNA sequence
    '''
    gc_content = (sequence.count('G') + sequence.count('C')) / len(sequence) * 100
    return {
        'length': len(sequence),
        'gc_content': gc_content
    }

# Example usage
dna_seq = 'ATGCGTACGTTAGC'
results = analyze_sequence(dna_seq)
print(f'Analysis Results: {results}')
"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  )
}
