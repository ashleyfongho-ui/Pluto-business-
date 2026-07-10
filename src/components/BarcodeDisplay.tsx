import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'
import { Download, Printer, X, QrCode } from 'lucide-react'

interface BarcodeDisplayProps {
  value: string
  label?: string
  format?: 'CODE128' | 'EAN13' | 'CODE39'
  width?: number
  height?: number
  showText?: boolean
  compact?: boolean
}

export function BarcodeDisplay({
  value,
  label,
  format = 'CODE128',
  height = 60,
  showText = true,
  compact = false,
}: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !value) return
    try {
      JsBarcode(svgRef.current, value, {
        format,
        height,
        displayValue: showText,
        fontSize: 11,
        margin: 4,
        lineColor: '#1e293b',
        background: '#ffffff',
      })
    } catch {
      // invalid value for format — ignore
    }
  }, [value, format, height, showText])

  if (compact) {
    return <svg ref={svgRef} className="w-full" />
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {label && <p className="text-xs font-medium text-gray-600">{label}</p>}
      <svg ref={svgRef} className="w-full max-w-[220px]" />
      <p className="text-xs font-mono text-gray-400">{value}</p>
    </div>
  )
}

// ─── Print Label Modal ────────────────────────────────────────────────────────
interface PrintLabelModalProps {
  items: Array<{ sku: string; name: string; batchId?: string; price?: number }>
  onClose: () => void
}

export function PrintLabelModal({ items, onClose }: PrintLabelModalProps) {
  const [copies, setCopies] = useState(1)
  const [labelSize, setLabelSize] = useState<'small' | 'medium' | 'large'>('medium')

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const labelW = labelSize === 'small' ? '50mm' : labelSize === 'medium' ? '80mm' : '100mm'
    const labelH = labelSize === 'small' ? '25mm' : labelSize === 'medium' ? '40mm' : '60mm'

    const labels = items.flatMap(item =>
      Array(copies).fill(0).map(() => item)
    )

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @page { margin: 5mm; }
          body { font-family: sans-serif; margin: 0; }
          .label-grid { display: flex; flex-wrap: wrap; gap: 4mm; }
          .label { width: ${labelW}; height: ${labelH}; border: 1px solid #ccc; padding: 2mm; 
                   display: flex; flex-direction: column; align-items: center; justify-content: center;
                   break-inside: avoid; page-break-inside: avoid; }
          .label-name { font-size: 9pt; font-weight: bold; text-align: center; margin-bottom: 2mm; }
          .label-sku { font-size: 7pt; color: #666; font-family: monospace; }
          svg { max-width: 100%; }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
      </head>
      <body>
        <div class="label-grid">
          ${labels.map((item, i) => `
            <div class="label">
              <div class="label-name">${item.name}</div>
              <svg id="bc${i}"></svg>
              <div class="label-sku">${item.batchId || item.sku}</div>
              ${item.price ? `<div class="label-sku">${item.price.toLocaleString()} CFA</div>` : ''}
            </div>
          `).join('')}
        </div>
        <script>
          ${labels.map((item, i) => `
            JsBarcode('#bc${i}', '${item.batchId || item.sku}', {
              format: 'CODE128', height: 40, displayValue: false, margin: 2
            });
          `).join('')}
          setTimeout(() => window.print(), 500);
        </script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Printer size={18} className="text-pluto-600" />
            <h2 className="font-semibold text-gray-900">Print Barcode Labels</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Label Size</label>
              <select
                value={labelSize}
                onChange={e => setLabelSize(e.target.value as 'small' | 'medium' | 'large')}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
              >
                <option value="small">Small (50×25mm)</option>
                <option value="medium">Medium (80×40mm)</option>
                <option value="large">Large (100×60mm)</option>
              </select>
            </div>
            <div className="w-24">
              <label className="text-xs text-gray-500 mb-1 block">Copies each</label>
              <input
                type="number"
                min={1}
                max={50}
                value={copies}
                onChange={e => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Items to print ({items.length} × {copies} = {items.length * copies} labels):</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{item.batchId || item.sku}</p>
                  </div>
                  {item.price && <span className="text-xs text-gray-500">{item.price.toLocaleString()} CFA</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700"
            >
              <Printer size={14} /> Print {items.length * copies} Labels
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Barcode Scanner Modal ────────────────────────────────────────────────────
interface BarcodeScannerProps {
  onScan: (value: string) => void
  onClose: () => void
  title?: string
}

export function BarcodeScannerModal({ onScan, onClose, title = 'Scan Barcode' }: BarcodeScannerProps) {
  const [manualEntry, setManualEntry] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    setError(null)

    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser')
      const reader = new BrowserMultiFormatReader()
      const imageUrl = URL.createObjectURL(file)
      const result = await reader.decodeFromImageUrl(imageUrl)
      URL.revokeObjectURL(imageUrl)
      onScan(result.getText())
    } catch {
      setError('Could not read barcode from image. Try scanning manually.')
    } finally {
      setScanning(false)
    }
  }

  const handleManualSubmit = () => {
    if (manualEntry.trim()) {
      onScan(manualEntry.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-pluto-600" />
            <h2 className="font-semibold text-gray-900">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Camera / photo input */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-pluto-200 bg-pluto-50 rounded-xl p-6 text-center cursor-pointer hover:border-pluto-400 hover:bg-pluto-100 transition-all"
          >
            <QrCode size={32} className="mx-auto text-pluto-400 mb-2" />
            {scanning ? (
              <p className="text-sm font-medium text-pluto-600 animate-pulse">Reading barcode…</p>
            ) : (
              <>
                <p className="text-sm font-medium text-pluto-700">Take a photo or upload barcode</p>
                <p className="text-xs text-gray-400 mt-1">Works with phone camera or barcode scanner images</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or enter manually</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={manualEntry}
              onChange={e => setManualEntry(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
              placeholder="Type or paste barcode / SKU…"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
              autoFocus
            />
            <button
              onClick={handleManualSubmit}
              disabled={!manualEntry.trim()}
              className="px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 disabled:opacity-40"
            >
              Find
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
