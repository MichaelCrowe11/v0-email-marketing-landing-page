"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkBreaks from "remark-breaks"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

function CodeBlock({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""
  const codeString = String(children).replace(/\n$/, "")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-border/50">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-border/50">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="!m-0 !rounded-none !bg-muted/30 p-3 overflow-x-auto">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-p:leading-relaxed prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:p-0 prose-pre:bg-transparent prose-code:text-primary prose-code:font-mono prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-a:text-primary prose-a:underline prose-a:decoration-primary/30 hover:prose-a:decoration-primary prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground prose-table:text-xs prose-th:text-left prose-th:font-semibold prose-td:py-1.5 prose-img:rounded-lg prose-hr:border-border/50">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className && typeof children === "string" && !children.includes("\n")
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded-md bg-muted text-primary text-xs font-mono" {...props}>
                  {children}
                </code>
              )
            }
            return <CodeBlock className={className} {...props}>{children}</CodeBlock>
          },
          pre({ children }) {
            return <>{children}</>
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 rounded-lg border border-border/50">
                <table className="min-w-full">{children}</table>
              </div>
            )
          },
          th({ children }) {
            return (
              <th className="px-3 py-2 bg-muted/50 text-left text-xs font-semibold border-b border-border/50">
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 text-xs border-b border-border/30">{children}</td>
            )
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-primary/30 hover:decoration-primary transition-colors">
                {children}
              </a>
            )
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-3 border-primary/40 pl-4 my-3 text-muted-foreground italic">
                {children}
              </blockquote>
            )
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>
          },
          img({ src, alt }) {
            return (
              <img src={src} alt={alt || ""} className="rounded-lg max-h-80 object-contain my-3 border border-border/30" />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
