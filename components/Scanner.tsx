'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, Loader2, Check, Scan, Image as ImageIcon } from 'lucide-react'
import Webcam from 'react-webcam'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { toast } from 'sonner'

interface ScannerProps {
  onClose: () => void
  onScanComplete: (result: unknown) => void
}

export default function Scanner({ onClose, onScanComplete }: ScannerProps) {
  const [mode, setMode] = useState<'photo' | 'barcode' | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      setCapturedImage(imageSrc)
    }
  }, [webcamRef])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const scanPhoto = async () => {
    if (!capturedImage) return

    setIsScanning(true)
    toast.loading('Analyse de l\'image en cours...')

    try {
      const response = await fetch('/api/scan/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage }),
      })

      const data = await response.json() as unknown

      if (response.ok) {
        toast.success('Scan réussi !')
        onScanComplete(data)
      } else {
        toast.error('Erreur lors du scan')
      }
    } catch (error) {
      console.error('Scanner error:', error)
      toast.error('Erreur de connexion')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Scanner un repas</h2>
                <p className="text-dark-500 text-sm mt-1">
                  Choisissez votre méthode de scan
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!mode && (
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('photo')}
                  className="p-8 rounded-xl border-2 border-dark-200 dark:border-dark-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 transition-all"
                >
                  <Camera className="w-12 h-12 mx-auto mb-4 text-primary-500" />
                  <h3 className="text-lg font-semibold mb-2">Photo</h3>
                  <p className="text-sm text-dark-500">
                    Scannez avec votre caméra ou importez une image
                  </p>
                </button>

                <button
                  onClick={() => setMode('barcode')}
                  className="p-8 rounded-xl border-2 border-dark-200 dark:border-dark-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 transition-all"
                >
                  <Scan className="w-12 h-12 mx-auto mb-4 text-primary-500" />
                  <h3 className="text-lg font-semibold mb-2">Code-barres</h3>
                  <p className="text-sm text-dark-500">
                    Scannez le code-barres d\'un produit
                  </p>
                </button>
              </div>
            )}

            {mode === 'photo' && (
              <div className="space-y-4">
                {!capturedImage ? (
                  <>
                    <div className="aspect-video rounded-xl overflow-hidden bg-dark-900">
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={capture} className="flex-1">
                        <Camera className="w-5 h-5" />
                        Capturer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="w-5 h-5" />
                        Importer
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        aria-label="Importer une image"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <img
                        src={capturedImage}
                        alt="Image capturée"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={scanPhoto}
                        isLoading={isScanning}
                        className="flex-1"
                      >
                        {!isScanning && <Check className="w-5 h-5" />}
                        Analyser
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCapturedImage(null)}
                        disabled={isScanning}
                      >
                        Reprendre
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {mode === 'barcode' && (
              <div className="space-y-4">
                <div className="p-8 text-center">
                  <Scan className="w-16 h-16 mx-auto mb-4 text-primary-500 animate-pulse" />
                  <p className="text-dark-500">
                    Présentez le code-barres devant la caméra
                  </p>
                </div>
                <Button variant="outline" onClick={() => setMode(null)} className="w-full">
                  Retour
                </Button>
              </div>
            )}

            {mode && mode !== 'barcode' && (
              <Button
                variant="ghost"
                onClick={() => {
                  setMode(null)
                  setCapturedImage(null)
                }}
                className="w-full mt-4"
              >
                Retour
              </Button>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}