import { useEffect, useRef } from 'react'
import { X, Printer } from 'lucide-react'
import JsBarcode from 'jsbarcode'

interface Props {
  sku: string
  name: string
  onClose: () => void
}

export default function BarcodeModal({ sku, name, onClose }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, sku, {
        format: 'CODE128',
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 14,
        margin: 10,
        background: '#ffffff',
        lineColor: '#1a1a2e',
      })
    }
  }, [sku])

  const handlePrint = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html><head><title>Barcode — ${sku}</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;}
      h2{font-size:14px;margin-bottom:8px;color:#333;}</style></head>
      <body>
        <h2>${name}</h2>
        ${svgData}
        <script>window.onload=()=>{window.print();window.close()}<\/script>
      </body></html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Barcode — {sku}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 flex justify-center mb-4">
          <svg ref={svgRef} />
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Close</button>
          <button onClick={handlePrint}
            className="flex-1 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 flex items-center justify-center gap-1.5">
            <Printer size={13} /> Print Label
          </button>
        </div>
      </div>
    </div>
  )
}
