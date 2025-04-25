"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Check,
  Save,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Code,
  Undo,
  Redo,
  Menu,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  saveStatus: "saved" | "saving"
}

export function MarkdownEditor({ value, onChange, saveStatus }: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit")
  const [undoStack, setUndoStack] = useState<string[]>([value])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastChangeRef = useRef<number>(Date.now())
  const isMobile = useIsMobile()

  // Track changes for undo/redo
  useEffect(() => {
    const now = Date.now()
    // Only add to undo stack if it's been more than 500ms since last change
    // and if the value has actually changed
    if (now - lastChangeRef.current > 500 && undoStack[undoStack.length - 1] !== value) {
      setUndoStack((prev) => [...prev, value])
      setRedoStack([])
      lastChangeRef.current = now
    }
  }, [value, undoStack])

  const handleUndo = () => {
    if (undoStack.length > 1) {
      const newUndoStack = [...undoStack]
      const currentState = newUndoStack.pop()!
      setUndoStack(newUndoStack)
      setRedoStack((prev) => [...prev, currentState])
      onChange(newUndoStack[newUndoStack.length - 1])
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack]
      const nextState = newRedoStack.pop()!
      setRedoStack(newRedoStack)
      setUndoStack((prev) => [...prev, nextState])
      onChange(nextState)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "z") {
        e.preventDefault()
        handleUndo()
      } else if (e.key === "y" || (e.shiftKey && e.key === "z")) {
        e.preventDefault()
        handleRedo()
      } else if (e.key === "b") {
        e.preventDefault()
        insertMarkdown("**", "**")
      } else if (e.key === "i") {
        e.preventDefault()
        insertMarkdown("*", "*")
      }
    }
  }

  const getSelectedText = (): { text: string; start: number; end: number } => {
    const textarea = textareaRef.current
    if (!textarea) return { text: "", start: 0, end: 0 }

    return {
      text: value.substring(textarea.selectionStart, textarea.selectionEnd),
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    }
  }

  const insertMarkdown = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    // Check if the selection already has this formatting
    const hasFormatting =
      selectedText.startsWith(prefix) &&
      selectedText.endsWith(suffix) &&
      selectedText.length >= prefix.length + suffix.length

    if (hasFormatting) {
      // Remove formatting
      const unformattedText = selectedText.substring(prefix.length, selectedText.length - suffix.length)
      const beforeText = value.substring(0, start)
      const afterText = value.substring(end)
      const newValue = beforeText + unformattedText + afterText
      onChange(newValue)

      // Set the cursor position after the operation
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + unformattedText.length)
      }, 0)
    } else {
      // Add formatting
      const beforeText = value.substring(0, start)
      const afterText = value.substring(end)
      const newValue = beforeText + prefix + selectedText + suffix + afterText
      onChange(newValue)

      // Set the cursor position after the operation
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + prefix.length, end + prefix.length)
      }, 0)
    }
  }

  const formatActions = [
    {
      icon: Bold,
      title: "Bold (Ctrl+B)",
      action: () => insertMarkdown("**", "**"),
      isActive: () => {
        const { text } = getSelectedText()
        return text.startsWith("**") && text.endsWith("**")
      },
    },
    {
      icon: Italic,
      title: "Italic (Ctrl+I)",
      action: () => insertMarkdown("*", "*"),
      isActive: () => {
        const { text } = getSelectedText()
        return (
          (text.startsWith("*") && text.endsWith("*") && !text.startsWith("**")) ||
          (text.startsWith("_") && text.endsWith("_"))
        )
      },
    },
    {
      icon: Heading1,
      title: "Heading 1",
      action: () => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        if (currentLine.startsWith("# ")) {
          // Remove heading
          const newValue =
            value.substring(0, lineStart) +
            currentLine.substring(2) +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        } else if (currentLine.startsWith("## ") || currentLine.startsWith("### ")) {
          // Replace with H1
          const newValue =
            value.substring(0, lineStart) +
            "# " +
            currentLine.substring(currentLine.indexOf(" ") + 1) +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        } else {
          // Add heading
          const newValue =
            value.substring(0, lineStart) +
            "# " +
            currentLine +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        }
      },
      isActive: () => {
        const textarea = textareaRef.current
        if (!textarea) return false

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        return currentLine.startsWith("# ")
      },
    },
    {
      icon: Heading2,
      title: "Heading 2",
      action: () => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        if (currentLine.startsWith("## ")) {
          // Remove heading
          const newValue =
            value.substring(0, lineStart) +
            currentLine.substring(3) +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        } else if (currentLine.startsWith("# ") || currentLine.startsWith("### ")) {
          // Replace with H2
          const newValue =
            value.substring(0, lineStart) +
            "## " +
            currentLine.substring(currentLine.indexOf(" ") + 1) +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        } else {
          // Add heading
          const newValue =
            value.substring(0, lineStart) +
            "## " +
            currentLine +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        }
      },
      isActive: () => {
        const textarea = textareaRef.current
        if (!textarea) return false

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        return currentLine.startsWith("## ")
      },
    },
    {
      icon: Heading3,
      title: "Heading 3",
      action: () => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        if (currentLine.startsWith("### ")) {
          // Remove heading
          const newValue =
            value.substring(0, lineStart) +
            currentLine.substring(4) +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        } else if (currentLine.startsWith("# ") || currentLine.startsWith("## ")) {
          // Replace with H3
          const newValue =
            value.substring(0, lineStart) +
            "### " +
            currentLine.substring(currentLine.indexOf(" ") + 1) +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        } else {
          // Add heading
          const newValue =
            value.substring(0, lineStart) +
            "### " +
            currentLine +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        }
      },
      isActive: () => {
        const textarea = textareaRef.current
        if (!textarea) return false

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        return currentLine.startsWith("### ")
      },
    },
    {
      icon: List,
      title: "Bullet List",
      action: () => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        if (currentLine.startsWith("* ")) {
          // Remove bullet
          const newValue =
            value.substring(0, lineStart) +
            currentLine.substring(2) +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        } else {
          // Add bullet
          const newValue =
            value.substring(0, lineStart) +
            "* " +
            currentLine +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        }
      },
      isActive: () => {
        const textarea = textareaRef.current
        if (!textarea) return false

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        return currentLine.startsWith("* ") || currentLine.startsWith("- ")
      },
    },
    {
      icon: ListOrdered,
      title: "Numbered List",
      action: () => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        // Check if line starts with a number followed by a period and space
        const numberedListRegex = /^\d+\.\s/

        if (numberedListRegex.test(currentLine)) {
          // Remove numbering
          const newValue =
            value.substring(0, lineStart) +
            currentLine.substring(currentLine.indexOf(" ") + 1) +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        } else {
          // Add numbering (always start with 1)
          const newValue =
            value.substring(0, lineStart) +
            "1. " +
            currentLine +
            value.substring(lineEnd === -1 ? value.length : lineEnd)
          onChange(newValue)
        }
      },
      isActive: () => {
        const textarea = textareaRef.current
        if (!textarea) return false

        const start = textarea.selectionStart
        const lineStart = value.lastIndexOf("\n", start - 1) + 1
        const lineEnd = value.indexOf("\n", start)
        const currentLine = value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

        const numberedListRegex = /^\d+\.\s/
        return numberedListRegex.test(currentLine)
      },
    },
    {
      icon: Link,
      title: "Link",
      action: () => {
        const { text, start, end } = getSelectedText()
        const textarea = textareaRef.current
        if (!textarea) return

        // Check if the selection is already a link
        const linkRegex = /^\[(.+)\]\((.+)\)$/
        const match = text.match(linkRegex)

        if (match) {
          // It's already a link, remove the formatting
          const linkText = match[1]
          const beforeText = value.substring(0, start)
          const afterText = value.substring(end)
          const newValue = beforeText + linkText + afterText
          onChange(newValue)

          // Set the cursor position after the operation
          setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start, start + linkText.length)
          }, 0)
        } else {
          // Not a link, add link formatting
          const beforeText = value.substring(0, start)
          const afterText = value.substring(end)
          const newValue = beforeText + "[" + (text || "link text") + "](url)" + afterText
          onChange(newValue)

          // Set the cursor position after the operation
          setTimeout(() => {
            textarea.focus()
            if (text) {
              // If there was selected text, select the URL part
              textarea.setSelectionRange(end + 3, end + 6)
            } else {
              // If there was no selected text, select the "link text" part
              textarea.setSelectionRange(start + 1, start + 10)
            }
          }, 0)
        }
      },
      isActive: () => {
        const { text } = getSelectedText()
        const linkRegex = /^\[(.+)\]\((.+)\)$/
        return linkRegex.test(text)
      },
    },
    {
      icon: ImageIcon,
      title: "Image",
      action: () => {
        const { text, start, end } = getSelectedText()
        const textarea = textareaRef.current
        if (!textarea) return

        // Check if the selection is already an image
        const imageRegex = /^!\[(.+)\]\((.+)\)$/
        const match = text.match(imageRegex)

        if (match) {
          // It's already an image, remove the formatting
          const altText = match[1]
          const beforeText = value.substring(0, start)
          const afterText = value.substring(end)
          const newValue = beforeText + altText + afterText
          onChange(newValue)

          // Set the cursor position after the operation
          setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start, start + altText.length)
          }, 0)
        } else {
          // Not an image, add image formatting
          const beforeText = value.substring(0, start)
          const afterText = value.substring(end)
          const newValue = beforeText + "![" + (text || "alt text") + "](image-url)" + afterText
          onChange(newValue)

          // Set the cursor position after the operation
          setTimeout(() => {
            textarea.focus()
            if (text) {
              // If there was selected text, select the URL part
              textarea.setSelectionRange(end + 4, end + 13)
            } else {
              // If there was no selected text, select the "alt text" part
              textarea.setSelectionRange(start + 2, start + 10)
            }
          }, 0)
        }
      },
      isActive: () => {
        const { text } = getSelectedText()
        const imageRegex = /^!\[(.+)\]\((.+)\)$/
        return imageRegex.test(text)
      },
    },
    {
      icon: Code,
      title: "Code",
      action: () => insertMarkdown("`", "`"),
      isActive: () => {
        const { text } = getSelectedText()
        return text.startsWith("`") && text.endsWith("`") && !text.startsWith("```")
      },
    },
    {
      icon: Undo,
      title: "Undo (Ctrl+Z)",
      action: handleUndo,
      isActive: () => false,
      disabled: () => undoStack.length <= 1,
    },
    {
      icon: Redo,
      title: "Redo (Ctrl+Y)",
      action: handleRedo,
      isActive: () => false,
      disabled: () => redoStack.length === 0,
    },
  ]

  // Render mobile-friendly formatting toolbar
  const renderMobileToolbar = () => (
    <div className="border-t p-2 flex items-center justify-between bg-background">
      <div className="flex space-x-1">
        {/* Show only the most important formatting options */}
        {formatActions.slice(0, 4).map((action, index) => (
          <Button
            key={index}
            variant={action.isActive() ? "secondary" : "ghost"}
            size="icon"
            onClick={action.action}
            title={action.title}
            disabled={action.disabled ? action.disabled() : false}
            className="h-8 w-8"
            aria-label={action.title}
          >
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* More options dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Menu className="h-4 w-4 mr-1" />
            <span>More</span>
            <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {formatActions.slice(4).map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={action.action}
              disabled={action.disabled ? action.disabled() : false}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.title}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUndo} disabled={undoStack.length <= 1}>
            <Undo className="h-4 w-4 mr-2" />
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRedo} disabled={redoStack.length === 0}>
            <Redo className="h-4 w-4 mr-2" />
            Redo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  // Render desktop formatting toolbar
  const renderDesktopToolbar = () => (
    <div className="border-t p-2 flex flex-wrap gap-1 bg-background">
      {formatActions.map((action, index) => (
        <Button
          key={index}
          variant={action.isActive() ? "secondary" : "ghost"}
          size="icon"
          onClick={action.action}
          title={action.title}
          disabled={action.disabled ? action.disabled() : false}
          className="h-8 w-8"
          aria-label={action.title}
        >
          <action.icon className="h-4 w-4" />
          <span className="sr-only">{action.title}</span>
        </Button>
      ))}
    </div>
  )

  return (
    <Card className="h-full flex flex-col border-0 rounded-none">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-base sm:text-xl">Markdown Editor</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Edit the markdown source code for the mindmap.
            </CardDescription>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            {saveStatus === "saved" ? (
              <>
                <Check className="h-4 w-4 mr-1 text-green-500" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1 animate-pulse" />
                <span>Saving...</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden"> {/* Changed from overflow-auto to overflow-hidden */}
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "edit" | "preview")}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full max-w-[200px] grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden"> {/* Changed from overflow-auto to overflow-hidden */}
            <TabsContent
              value="edit"
              className="m-0 h-full data-[state=active]:flex-1 data-[state=active]:flex flex-col"
            >
              <div className="flex-1 relative overflow-auto"> {/* Added overflow-auto here */}
                <textarea
                  ref={textareaRef}
                  className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-background"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  aria-label="Markdown editor textarea"
                />
              </div>

              {/* Responsive formatting toolbar */}
              {isMobile ? renderMobileToolbar() : renderDesktopToolbar()}
            </TabsContent>

            <TabsContent 
              value="preview" 
              className="m-0 h-full data-[state=active]:flex-1 data-[state=active]:flex"
            >
              <div
                className="markdown-preview p-4 overflow-auto h-full w-full prose prose-sm dark:prose-invert max-w-none" 
                aria-label="Markdown preview"
                tabIndex={0}
              >
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Improved markdown to HTML converter for preview
// function markdownToHtml(markdown: string): string {
//   if (!markdown) return ""
  
//   // Process code blocks with language support
//   let html = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, language, code) {
//     return `<pre><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
//   });

//   // Process horizontal rules
//   html = html.replace(/^---+$/gm, '<hr>');
  
//   // Handle paragraphs before other inline elements
//   // Split content into blocks by empty lines
//   const blocks = html.split(/\n{2,}/);
  
//   html = blocks.map(block => {
//     block = block.trim();
//     if (!block) return '';
    
//     // Skip blocks that are already HTML or special blocks (lists, code blocks)
//     if (
//       block.startsWith('<') || 
//       block.startsWith('#') || 
//       block.startsWith('* ') ||
//       block.startsWith('- ') ||
//       block.match(/^\d+\.\s/) ||
//       block.startsWith('```')
//     ) {
//       return block;
//     }
    
//     // Everything else becomes a paragraph
//     return `<p>${block}</p>`;
//   }).join('\n\n');

//   // Process headers
//   html = html
//     .replace(/^# (.+)$/gm, '<h1>$1</h1>')
//     .replace(/^## (.+)$/gm, '<h2>$1</h2>')
//     .replace(/^### (.+)$/gm, '<h3>$1</h3>')
//     .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
//     .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
//     .replace(/^###### (.+)$/gm, '<h6>$1</h6>');

//   // Process lists more carefully
//   // First, identify all list blocks
//   const bulletListRegex = /^[*\-] .+(?:\n[*\-] .+)*$/gm;
//   const numberedListRegex = /^\d+\. .+(?:\n\d+\. .+)*$/gm;
  
//   // Process bullet lists
//   html = html.replace(bulletListRegex, function(listBlock) {
//     const items = listBlock.split(/\n/).map(item => {
//       return `<li>${item.substring(2)}</li>`;
//     }).join('');
//     return `<ul>${items}</ul>`;
//   });
  
//   // Process numbered lists
//   html = html.replace(numberedListRegex, function(listBlock) {
//     const items = listBlock.split(/\n/).map(item => {
//       return `<li>${item.substring(item.indexOf(' ') + 1)}</li>`;
//     }).join('');
//     return `<ol>${items}</ol>`;
//   });

//   // Process inline code
//   html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
//   // Process bold and italic text
//   html = html
//     .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
//     .replace(/\*([^*]+)\*/g, '<em>$1</em>')
//     .replace(/__([^_]+)__/g, '<strong>$1</strong>')
//     .replace(/_([^_]+)_/g, '<em>$1</em>');
  
//   // Process strikethrough
//   html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

//   // Fix links and images (this was the main issue)
//   html = html
//     .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
//     .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');

//   return html;
// }

// Improved markdown to HTML converter for preview
function markdownToHtml(markdown: string): string {
  if (!markdown) return ""
  
  // Process code blocks with language support
  let html = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, language, code) {
    return `<pre><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Process horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');
  
  // Process headers
  html = html
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>');

  // Process lists with proper nesting
  html = processList(html);

  // Process blocks that should be paragraphs (after headers and lists are handled)
  html = processParagraphs(html);
  
  // Process inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Process bold and italic text
  html = html
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>');
  
  // Process strikethrough
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // Fix links and images
  html = html
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');

  return html;
}

// Process paragraphs carefully after other elements are handled
function processParagraphs(text: string): string {
  // Split by HTML elements to avoid wrapping them in <p> tags
  const pieces = text.split(/(<\/?[a-z][^>]*>)/gi);
  let inHtml = false;
  
  for (let i = 0; i < pieces.length; i++) {
    // Skip HTML tags and content already in HTML
    if (pieces[i].startsWith('<')) {
      inHtml = !pieces[i].startsWith('</') || pieces[i] === '</li>';
      continue;
    }
    
    if (!inHtml && pieces[i].trim() && !pieces[i].match(/^(\s*)[*\-] /) && !pieces[i].match(/^(\s*)\d+\.\s/)) {
      // Wrap non-empty, non-list content in paragraphs
      pieces[i] = `<p>${pieces[i].trim()}</p>`;
    }
  }
  
  return pieces.join('');
}

// Define an interface for list items
interface ListItem {
  type: string;
  indent: number;
}

// Process nested lists with indentation support
function processList(text: string): string {
  // Split the text into lines for processing
  let lines = text.split('\n');
  let inList = false;
  let html: string[] = [];
  let listStack: ListItem[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let bulletMatch = line.match(/^(\s*)[\-*] (.+)$/);
    let numberMatch = line.match(/^(\s*)\d+\. (.+)$/);
    
    // Check if this line is a list item
    if (bulletMatch || numberMatch) {
      let match = bulletMatch || numberMatch;
      if (!match) continue; // TypeScript safety - we know this won't happen due to the if condition
      
      let indent = match[1].length;
      let content = match[2];
      let type = bulletMatch ? 'ul' : 'ol';
      
      // If we're not in a list yet, start one
      if (!inList) {
        listStack.push({ type, indent });
        html.push(`<${type}>`);
        inList = true;
      } 
      // If we are in a list, check if we need to change levels
      else {
        if (listStack.length === 0) {
          // Safety check - this shouldn't happen if inList is true, but ensures type safety
          listStack.push({ type, indent });
          html.push(`<${type}>`);
        } else {
          let currentList = listStack[listStack.length - 1];
          
          // Going deeper in nesting
          if (indent > currentList.indent) {
            // Start a new nested list before the item
            listStack.push({ type, indent });
            html[html.length - 1] += `<${type}>`;
          }
          // Coming back to a higher level
          else if (indent < currentList.indent) {
            // Close deeper lists until we're at the right level
            while (listStack.length > 0 && indent < listStack[listStack.length - 1].indent) {
              let popped = listStack.pop();
              if (popped) { // Check that popped is not undefined
                html.push(`</${popped.type}></li>`);
              }
            }
            
            // If we popped all lists, we need to start a new one
            if (listStack.length === 0) {
              listStack.push({ type, indent });
              html.push(`<${type}>`);
            }
          }
          // Same level but different list type
          else if (type !== currentList.type) {
            // Close the current list and start a new one of the different type
            html.push(`</${currentList.type}>`);
            listStack.pop();
            listStack.push({ type, indent });
            html.push(`<${type}>`);
          }
          // Same level and type, just close the previous list item
          else {
            // Close the previous list item
            html[html.length - 1] += '</li>';
          }
        }
      }
      
      // Add the new list item
      html.push(`<li>${content}`);
    }
    // Not a list item
    else if (inList) {
      // If there's content after a list item that's not a new list item,
      // it belongs to the previous list item (this handles multi-line items)
      if (line.trim() !== '') {
        html[html.length - 1] += ' ' + line.trim();
      }
      // Empty line - close all open lists
      else {
        while (listStack.length > 0) {
          let list = listStack.pop();
          if (list) { // Check that list is not undefined
            html.push(`</li></${list.type}>`);
          }
        }
        inList = false;
        html.push(''); // Add an empty line
      }
    }
    // Regular content, not in a list
    else {
      html.push(line);
    }
  }
  
  // Close any remaining open lists
  if (inList) {
    while (listStack.length > 0) {
      let list = listStack.pop();
      if (list) { // Check that list is not undefined
        html.push(`</li></${list.type}>`);
      }
    }
  }
  
  return html.join('\n');
}

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}