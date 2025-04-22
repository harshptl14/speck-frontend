"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RefreshCw, Maximize, Download, Minimize, Copy, Menu, DownloadCloudIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { Transformer } from "markmap-lib"
import { Markmap } from "markmap-view"
import html2canvas from "html2canvas"
import { debounce } from "lodash"

interface MarkmapViewerProps {
  markdown: string
}

export function MarkmapViewer({ markdown }: MarkmapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const markmapRef = useRef<Markmap | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()

  // Initialize markmap transformer
  const transformer = useRef(new Transformer())

  const cardRef = useRef<HTMLDivElement>(null)

  // Debounced zoom functions for performance
  const handleZoomIn = useCallback(
    debounce(() => {
      if (markmapRef.current) {
        markmapRef.current.rescale(1.2)
      }
    }, 100),
    [],
  )

  const handleZoomOut = useCallback(
    debounce(() => {
      if (markmapRef.current) {
        markmapRef.current.rescale(0.8)
      }
    }, 100),
    [],
  )

  const handleReset = useCallback(
    debounce(() => {
      if (markmapRef.current) {
        markmapRef.current.fit()
      }
    }, 100),
    [],
  )

  const handleExportPNG = useCallback(async () => {
    if (!containerRef.current || !svgRef.current || !markmapRef.current) {
      setError("Mind map not fully loaded for PNG export")
      return
    }

    try {
      // Show a loading indicator
      setIsLoading(true)

      // First ensure the map is properly fitted
      markmapRef.current.fit()

      // Wait a moment for the fit animation to complete
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Create a temporary container for export to ensure proper centering
      const exportContainer = document.createElement("div")
      exportContainer.style.position = "absolute"
      exportContainer.style.left = "-9999px"
      exportContainer.style.top = "-9999px"
      exportContainer.style.width = "1200px" // Fixed width for export
      exportContainer.style.height = "900px" // Fixed height for export
      exportContainer.style.backgroundColor = "white"
      exportContainer.style.padding = "50px"
      exportContainer.style.overflow = "hidden"
      document.body.appendChild(exportContainer)

      // Clone the SVG for export
      const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement
      svgClone.style.width = "100%"
      svgClone.style.height = "100%"
      svgClone.style.maxWidth = "none"
      svgClone.style.maxHeight = "none"

      // Center the content by adjusting the transform
      const mainGroup = svgClone.querySelector("g")
      if (mainGroup) {
        // Get the original transform
        const originalTransform = mainGroup.getAttribute("transform") || ""
        const match = originalTransform.match(/translate$$([-\d.]+),([-\d.]+)$$/)

        if (match && match.length >= 3) {
          // Calculate centering offsets
          const translateX = Number.parseFloat(match[1])
          const translateY = Number.parseFloat(match[2])
          const centerX = 600 - translateX // Center in 1200px width
          const centerY = 450 - translateY // Center in 900px height

          // Apply centered transform
          mainGroup.setAttribute("transform", `translate(${centerX},${centerY})`)
        }
      }

      exportContainer.appendChild(svgClone)

      // Use html2canvas with higher quality settings
      const canvas = await html2canvas(exportContainer, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher resolution for export
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0, // No timeout for image loading
      })

      // Clean up the temporary container
      document.body.removeChild(exportContainer)

      // Create a timestamp for unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")

      // Create and trigger download
      const link = document.createElement("a")
      link.download = `mindmap-${timestamp}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      setIsLoading(false)
    } catch (err) {
      console.error("Error exporting PNG:", err)
      setError("Failed to export as PNG")
      setIsLoading(false)
    }
  }, [markmapRef])

  // Improved function to export as SVG with preserved styles
  const handleExportSVG = useCallback(() => {
    if (!svgRef.current || !markmapRef.current) {
      setError("Mind map not fully loaded for SVG export")
      return
    }

    try {
      const originalSvg = svgRef.current
      const computedStyle = window.getComputedStyle(originalSvg)

      // Create a new SVG element with proper namespace
      const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")

      // Get or calculate viewBox
      let viewBox = originalSvg.getAttribute("viewBox")
      if (!viewBox) {
        try {
          // Ensure the map is properly fitted before export
          markmapRef.current.fit()

          // Calculate viewBox from the transform of the main group
          const transformString = originalSvg.querySelector("g")?.getAttribute("transform")
          if (transformString) {
            const match = transformString.match(/translate$$([-\d.]+),([-\d.]+)$$/)
            if (match && match.length >= 3) {
              const translateX = Number.parseFloat(match[1])
              const translateY = Number.parseFloat(match[2])
              const margin = 100 // Increased margin for better spacing
              const width = originalSvg.clientWidth || 800
              const height = originalSvg.clientHeight || 600
              viewBox = `${-translateX - margin} ${-translateY - margin} ${width + margin * 2} ${height + margin * 2}`
            }
          }
        } catch (e) {
          console.warn("Could not calculate viewBox from transform:", e)
        }

        // Fallback to getBBox if transform method fails
        if (!viewBox) {
          try {
            const bbox = originalSvg.getBBox()
            const margin = 100 // Increased margin for better spacing
            viewBox = `${bbox.x - margin} ${bbox.y - margin} ${bbox.width + margin * 2} ${bbox.height + margin * 2}`
          } catch (e) {
            console.warn("Could not calculate viewBox from SVG bbox:", e)
            viewBox = "0 0 800 600" // Default fallback
          }
        }
      }

      // Set SVG attributes for high-quality export
      newSvg.setAttribute("viewBox", viewBox)
      newSvg.setAttribute("width", "1200") // Increased size for better quality
      newSvg.setAttribute("height", "900")
      newSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
      newSvg.setAttribute("version", "1.1")
      newSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")

      // Set background color
      const bgColor = computedStyle.backgroundColor === "rgba(0, 0, 0, 0)" ? "white" : computedStyle.backgroundColor
      newSvg.style.backgroundColor = bgColor

      // Deep clone SVG content
      newSvg.innerHTML = originalSvg.innerHTML

      // Create style element for embedded CSS
      const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style")

      // Select representative elements for styling
      const nodeText = originalSvg.querySelector(".markmap-node-text")
      const linkPath = originalSvg.querySelector(".markmap-link")
      const nodeCircle = originalSvg.querySelector(".markmap-node > circle")
      const nodeGroup = originalSvg.querySelector(".markmap-node")

      // Initialize default styles
      const styles = {
        text: {
          fill: "#212529",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: "10px",
          fontWeight: "400",
          fontStyle: "normal",
        },
        link: {
          stroke: "#999",
          strokeWidth: "1.5px",
          fill: "none",
        },
        circle: {
          fill: "#fff",
          stroke: "#999",
          strokeWidth: "1.5px",
        },
        group: {
          cursor: "pointer",
        },
        svg: {
          backgroundColor: bgColor,
        },
      }

      // Extract computed styles for accurate rendering
      if (nodeText) {
        const textStyle = window.getComputedStyle(nodeText)
        styles.text = {
          fill: textStyle.color || styles.text.fill,
          fontFamily: textStyle.fontFamily || styles.text.fontFamily,
          fontSize: textStyle.fontSize || styles.text.fontSize,
          fontWeight: textStyle.fontWeight || styles.text.fontWeight,
          fontStyle: textStyle.fontStyle || styles.text.fontStyle,
        }
      }

      if (linkPath) {
        const linkStyle = window.getComputedStyle(linkPath)
        styles.link = {
          stroke: linkStyle.stroke || styles.link.stroke,
          strokeWidth: linkStyle.strokeWidth || styles.link.strokeWidth,
          fill: linkStyle.fill || styles.link.fill,
        }
      }

      if (nodeCircle) {
        const circleStyle = window.getComputedStyle(nodeCircle)
        styles.circle = {
          fill: circleStyle.fill || styles.circle.fill,
          stroke: circleStyle.stroke || styles.circle.stroke,
          strokeWidth: circleStyle.strokeWidth || styles.circle.strokeWidth,
        }
      }

      if (nodeGroup) {
        const groupStyle = window.getComputedStyle(nodeGroup)
        styles.group = {
          cursor: groupStyle.cursor || styles.group.cursor,
        }
      }

      // Embed comprehensive CSS with !important to ensure styles are applied
      styleElement.textContent = `
        .markmap-node > circle {
          fill: ${styles.circle.fill} !important;
          stroke: ${styles.circle.stroke} !important;
          stroke-width: ${styles.circle.strokeWidth} !important;
        }
        .markmap-node-text {
          fill: ${styles.text.fill} !important;
          font-family: ${styles.text.fontFamily} !important;
          font-size: ${styles.text.fontSize} !important;
          font-weight: ${styles.text.fontWeight} !important;
          font-style: ${styles.text.fontStyle} !important;
          text-anchor: middle !important;
        }
        .markmap-link {
          fill: ${styles.link.fill} !important;
          stroke: ${styles.link.stroke} !important;
          stroke-width: ${styles.link.strokeWidth} !important;
        }
        .markmap-node {
          cursor: ${styles.group.cursor} !important;
        }
        .markmap {
          background-color: ${styles.svg.backgroundColor} !important;
        }
        /* Ensure font fallback consistency */
        text {
          font-family: ${styles.text.fontFamily} !important;
        }
      `

      newSvg.insertBefore(styleElement, newSvg.firstChild)

      // Add a background rectangle for consistent rendering
      const backgroundRect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      backgroundRect.setAttribute("width", "100%")
      backgroundRect.setAttribute("height", "100%")
      backgroundRect.setAttribute("fill", bgColor)
      newSvg.insertBefore(backgroundRect, newSvg.firstChild)

      // Serialize SVG with proper XML declaration
      const serializer = new XMLSerializer()
      let svgString = serializer.serializeToString(newSvg)
      svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString

      // Create and trigger download with a more descriptive filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const blob = new Blob([svgString], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `mindmap-${timestamp}.svg`
      link.href = url
      link.click()

      // Clean up
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error exporting SVG:", err)
      setError("Failed to export as SVG")
    }
  }, [markmapRef])

  const handleCopyMarkdown = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Error copying markdown:", err)
      setError("Failed to copy markdown")
    }
  }, [markdown])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      cardRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`)
        setError("Failed to enable fullscreen")
      })
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  useEffect(() => {
    let isMounted = true

    const loadMarkmap = async () => {
      if (!containerRef.current || !svgRef.current) return

      setIsLoading(true)
      setError(null)

      try {
        // Transform markdown to markmap data
        const { root } = transformer.current.transform(markdown)

        // Create markmap instance with the SVG element
        if (isMounted) {
          markmapRef.current = Markmap.create(svgRef.current, {
            autoFit: true,
            fitRatio: 0.95,
          })
          markmapRef.current.setData(root)
          markmapRef.current.fit()
        }
      } catch (err) {
        console.error("Error rendering markmap:", err)
        if (isMounted) {
          setError("Failed to render mind map")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMarkmap()

    return () => {
      isMounted = false
      if (markmapRef.current) {
        markmapRef.current.destroy()
        markmapRef.current = null
      }
    }
  }, [markdown])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") {
        handleZoomIn()
      } else if (e.key === "-") {
        handleZoomOut()
      } else if (e.key === "0") {
        handleReset()
      } else if (e.key === "f") {
        toggleFullscreen()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleZoomIn, handleZoomOut, handleReset, toggleFullscreen])

  // Add a new function to handle combined export options
  const handleExport = useCallback(
    (format: "svg" | "png") => {
      // Show a loading indicator
      setIsLoading(true)

      // Use setTimeout to allow the UI to update before starting the export
      setTimeout(() => {
        try {
          if (format === "svg") {
            handleExportSVG()
          } else {
            handleExportPNG()
          }
        } catch (err) {
          console.error(`Error during ${format.toUpperCase()} export:`, err)
          setError(`Failed to export as ${format.toUpperCase()}`)
        } finally {
          // Ensure loading state is reset
          setIsLoading(false)
        }
      }, 100)
    },
    [handleExportSVG, handleExportPNG],
  )

  // Render mobile toolbar with dropdown menu
  const renderMobileToolbar = () => (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-base">Mind Map</CardTitle>
        <CardDescription className="text-xs">Live preview</CardDescription>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="icon" onClick={handleReset} aria-label="Reset View">
          <RefreshCw className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More options">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4 mr-2" />
              Zoom In
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4 mr-2" />
              Zoom Out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport("png")}>
              <Download className="h-4 w-4 mr-2" />
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("svg")}>
              <DownloadCloudIcon className="h-4 w-4 mr-2" />
              Export as SVG
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCopyMarkdown}>
              <Copy className="h-4 w-4 mr-2" />
              {copySuccess ? "Copied!" : "Copy Markdown"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleFullscreen}>
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-2" />
                  Fullscreen
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  // Render desktop toolbar with tooltips
  const renderDesktopToolbar = () => (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>Mind Map Preview</CardTitle>
        <CardDescription>Live preview of the mindmap.</CardDescription>
      </div>
      <TooltipProvider>
        <div className="flex space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleZoomIn} aria-label="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleZoomOut} aria-label="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleReset} aria-label="Reset View">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset View</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => handleExport("png")} aria-label="Export as PNG">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export as PNG</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => handleExport("svg")} aria-label="Export as SVG">
                <DownloadCloudIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export as SVG</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyMarkdown}
                className={copySuccess ? "bg-green-100 dark:bg-green-900" : ""}
                aria-label="Copy Markdown"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copySuccess ? "Copied!" : "Copy Markdown"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )

  return (
    <Card
      ref={cardRef}
      className={`h-full flex flex-col border-0 rounded-none ${isFullscreen ? "fixed inset-0 z-50 bg-background !bg-white dark:!bg-gray-900" : ""}`}
    >
      <CardHeader className="pb-2 px-3 sm:px-6">{isMobile ? renderMobileToolbar() : renderDesktopToolbar()}</CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div
          ref={containerRef}
          className="w-full h-full relative"
          role="region"
          aria-label="Mind map visualization"
          tabIndex={0}
        >
          <svg ref={svgRef} className="w-full h-full bg-white dark:bg-gray-900" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <p className="text-muted-foreground">Loading mind map...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Processing export...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
