"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Sparkles, Play, Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function Home() {
  const [frame, setFrame] = useState<string | null>(null)
  const [video, setVideo] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultVideo, setResultVideo] = useState<string | null>(null)

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setFrame(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setVideo(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    setIsProcessing(true)
    setProgress(0)
    setResultVideo(null)

    // Simula progresso realista de processamento
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Progresso não-linear (mais lento no início e fim)
        if (prev < 30) return prev + 3
        if (prev < 80) return prev + 8
        return prev + 2
      })
    }, 200)

    // Após "processar", usa o vídeo original como resultado
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setResultVideo(video)
      setIsProcessing(false)
    }, 5000)
  }

  const handleReset = () => {
    setFrame(null)
    setVideo(null)
    setResultVideo(null)
    setProgress(0)
  }

  const handleDownload = () => {
    if (resultVideo) {
      const link = document.createElement("a")
      link.href = resultVideo
      link.download = `geneseez-result-${Date.now()}.mp4`
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Geneseez</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">Transferência de Movimento</h1>
          <p className="text-lg text-muted-foreground">Sua imagem. Qualquer movimento.</p>
        </div>

        {resultVideo ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-bold text-primary">Resultado Pronto!</h2>
              <p className="text-sm text-muted-foreground">Seu vídeo com transferência de movimento</p>
            </div>

            <div className="mb-6 overflow-hidden rounded-lg border border-border bg-card">
              <video src={resultVideo} className="w-full" controls autoPlay loop />
            </div>

            <div className="flex justify-center gap-3">
              <Button onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Baixar Resultado
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Nova Geração
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Upload Area */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {/* Frame Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium">1. Sua Imagem</label>
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-border bg-card transition-colors hover:border-primary/50">
                  {frame ? (
                    <img src={frame || "/placeholder.svg"} alt="Frame" className="h-full w-full object-cover" />
                  ) : (
                    <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-3 p-6">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Upload da imagem</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG até 10MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleFrameUpload} className="hidden" />
                    </label>
                  )}
                  {frame && !isProcessing && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute right-2 top-2"
                      onClick={() => setFrame(null)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium">2. Vídeo de Movimento</label>
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-border bg-card transition-colors hover:border-primary/50">
                  {video ? (
                    <video src={video} className="h-full w-full object-cover" controls />
                  ) : (
                    <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-3 p-6">
                      <Play className="h-8 w-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Upload do vídeo</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV até 50MB</p>
                      </div>
                      <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    </label>
                  )}
                  {video && !isProcessing && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute right-2 top-2"
                      onClick={() => setVideo(null)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {isProcessing && (
              <div className="mb-8 mx-auto max-w-md">
                <div className="mb-2 text-center">
                  <p className="text-sm font-medium">Processando transferência de movimento...</p>
                  <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}% completo</p>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button size="lg" onClick={handleGenerate} disabled={!frame || !video || isProcessing} className="gap-2">
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Gerar Resultado
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Info Cards */}
        {!resultVideo && (
          <div className="mt-20 grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <div className="mb-2 text-2xl font-bold text-primary">01</div>
              <h3 className="mb-1 font-semibold">Uma Imagem</h3>
              <p className="text-sm text-muted-foreground">Define a identidade</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <div className="mb-2 text-2xl font-bold text-primary">02</div>
              <h3 className="mb-1 font-semibold">Qualquer Vídeo</h3>
              <p className="text-sm text-muted-foreground">Extrai o movimento</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <div className="mb-2 text-2xl font-bold text-primary">03</div>
              <h3 className="mb-1 font-semibold">Resultado Único</h3>
              <p className="text-sm text-muted-foreground">Combinação perfeita</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>Geneseez - Tecnologia de transferência de movimento</p>
      </footer>
    </div>
  )
}
