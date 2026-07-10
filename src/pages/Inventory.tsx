import { useState, useRef } from 'react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { inventory, systemUsers } from '../data/mockData'
import { AlertTriangle, Package, Truck, Plus, ChevronDown, ChevronRight, Upload, Scan, X, Check, Shield, FileText, DollarSign } from 'lucide-react'

const locationColors: Record<string, string> = {
  'Warehouse': 'bg-blue-100 text-blue-700',
  'In Transit': 'bg-amber-100 text-amber-700',
  'At Market': 'bg-green-100 text-green-700',
}

function daysToExpiry(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default function Inventory() {
  const { t } = useLang()
  const [filter, setFilter] = useState<'all' | 'expiring' | 'low' | 'transit'>('all')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  // Compute summary stats across all batches
  const expiringItems = inventory.filter(i =>
    i.batches.some(b => { const d = daysToExpiry(b.expiryDate); return d <= 30 && d > 0 })
  )
  const lowStockItems = inventory.filter(i => {
    const total = i.batches.reduce((s, b) => s + b.totalUnits, 0)
    const sold = i.batches.reduce((s, b) => s + b.soldUnits, 0)
    return (total - sold) <= i.lowStockThreshold
  })
  const inTransitItems = inventory.filter(i =>
    i.batches.some(b => b.location === 'In Transit')
  )

  const filtered = filter === 'expiring' ? expiringItems
    : filter === 'low' ? lowStockItems
    : filter === 'transit' ? inTransitItems
    : inventory

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Add stock / OCR modal state
  const [showAddStock, setShowAddStock] = useState(false)
  const [addTab, setAddTab] = useState<'manual' | 'receipt' | 'insurance'>('manual')
  const [ocrState, setOcrState] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [receiptFile, setReceiptFile] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Simulated OCR parsed result
  const ocrResult = [
    { description: 'Paracetamol 500mg (x500)', qty: 500, unitCost: 450, total: 225000 },
    { description: 'Amoxicillin 250mg (x100)', qty: 100, unitCost: 1200, total: 120000 },
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReceiptFile(file.name)
    setOcrState('scanning')
    // Simulate OCR delay
    setTimeout(() => setOcrState('done'), 2800)
  }

  return (
    <>
      <TopBar title={t('inventory')} />
      <main className="p-6">
        {/* Alert summary */}
        <div className="flex gap-3 mb-6">
          {[
            { key: 'expiring', icon: AlertTriangle, label: `${expiringItems.length} expiring soon`, color: 'border-amber-200 bg-amber-50 text-amber-700' },
            { key: 'low', icon: Package, label: `${lowStockItems.length} low stock`, color: 'border-red-200 bg-red-50 text-red-700' },
            { key: 'transit', icon: Truck, label: `${inTransitItems.length} in transit`, color: 'border-blue-200 bg-blue-50 text-blue-700' },
          ].map(a => (
            <button key={a.key} onClick={() => setFilter(filter === a.key as any ? 'all' : a.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${a.color} ${filter === a.key ? 'ring-2 ring-offset-1 ring-pluto-400' : 'opacity-80 hover:opacity-100'}`}>
              <a.icon size={14} />
              {a.label}
            </button>
          ))}
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="text-xs text-gray-400 hover:text-gray-600 self-center ml-2">Clear filter ×</button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">{filtered.length} SKU{filtered.length !== 1 ? 's' : ''}</p>
            <button onClick={() => { setShowAddStock(true); setOcrState('idle'); setReceiptFile(null) }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
              <Plus size={13} /> Add Stock
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-8 px-4 py-3"></th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Batches</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Total Units</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Remaining</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Alerts</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const totalUnits = item.batches.reduce((s, b) => s + b.totalUnits, 0)
                const soldUnits = item.batches.reduce((s, b) => s + b.soldUnits, 0)
                const remaining = totalUnits - soldUnits
                const isLow = remaining <= item.lowStockThreshold
                const isExpiring = item.batches.some(b => { const d = daysToExpiry(b.expiryDate); return d <= 30 && d > 0 })
                const hasTransit = item.batches.some(b => b.location === 'In Transit')
                const isExpanded = expanded.has(item.id)

                return (
                  <>
                    <tr
                      key={item.id}
                      onClick={() => toggleExpand(item.id)}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-gray-400">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-pluto-600">{item.sku}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-gray-500">{item.category}</td>
                      <td className="px-4 py-3 text-gray-500">{item.batches.length} batch{item.batches.length !== 1 ? 'es' : ''}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{totalUnits.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>{remaining.toLocaleString()}</span>
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${isLow ? 'bg-red-400' : 'bg-pluto-500'}`}
                              style={{ width: `${totalUnits > 0 ? Math.min(100, (remaining / totalUnits) * 100) : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {isLow && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded font-medium">Low</span>}
                          {isExpiring && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-xs rounded font-medium">Exp</span>}
                          {hasTransit && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded font-medium">Transit</span>}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded batch rows */}
                    {isExpanded && item.batches.map(batch => {
                      const batchRemaining = batch.totalUnits - batch.soldUnits
                      const bExp = daysToExpiry(batch.expiryDate)
                      const bExpiring = bExp <= 30 && bExp > 0
                      return (
                        <tr key={batch.batchId} className="bg-gray-50 border-b border-gray-100">
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2 font-mono text-xs text-gray-400">{batch.batchId}</td>
                          <td className="px-4 py-2 text-xs text-gray-500 col-span-2">
                            <span className="text-gray-400">Purchased</span> {batch.purchaseDate}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${locationColors[batch.location] || 'bg-gray-100 text-gray-600'}`}>
                              {batch.location}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-500">{batch.soldUnits}/{batch.totalUnits}</td>
                          <td className="px-4 py-2 text-xs">
                            <span className={bExpiring ? 'text-amber-600 font-medium' : 'text-gray-400'}>
                              {batch.expiryDate}{bExpiring ? ` (${bExp}d)` : ''}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-500">
                            {batch.costPerUnit.toLocaleString()} → {batch.sellPerUnit.toLocaleString()} CFA
                          </td>
                        </tr>
                      )
                    })}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
      {/* Add Stock Modal */}
      {showAddStock && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Add Stock / Purchase</h2>
              <button onClick={() => setShowAddStock(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mx-6 mt-4 mb-4">
              {([['manual', 'Manual Entry'], ['receipt', 'Upload Receipt (OCR)'], ['insurance', 'Insurance / Docs']] as const).map(([key, label]) => (
                <button key={key} onClick={() => { setAddTab(key); setOcrState('idle'); setReceiptFile(null) }}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                    addTab === key ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'
                  }`}>{label}</button>
              ))}
            </div>

            <div className="px-6 pb-6">
              {addTab === 'manual' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">SKU / Product</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                        {inventory.map(i => <option key={i.id}>{i.name} ({i.sku})</option>)}
                        <option value="new">+ New product</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Supplier</label>
                      <input placeholder="Supplier name" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Qty Purchased</label>
                      <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Cost / Unit (CFA)</label>
                      <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Sell Price / Unit</label>
                      <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Purchase Date</label>
                      <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Expiry Date</label>
                      <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Location</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                        <option>Warehouse</option>
                        <option>In Transit</option>
                        <option>At Market</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Allocated To</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                        <option value="">— All team</option>
                        {systemUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setShowAddStock(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                    <button onClick={() => setShowAddStock(false)} className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Add to Inventory</button>
                  </div>
                </div>
              )}

              {addTab === 'receipt' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Upload a supplier receipt or invoice. The system will parse the items and quantities automatically.</p>

                  {ocrState === 'idle' && (
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-pluto-200 bg-pluto-50 rounded-xl p-8 text-center cursor-pointer hover:border-pluto-400 hover:bg-pluto-100 transition-all">
                      <Upload size={28} className="mx-auto text-pluto-400 mb-3" />
                      <p className="text-sm font-medium text-pluto-700">Click to upload receipt</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, or PDF — supplier invoice / receipt</p>
                      <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />
                    </div>
                  )}

                  {ocrState === 'scanning' && (
                    <div className="border border-pluto-200 bg-pluto-50 rounded-xl p-8 text-center">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <Scan size={24} className="text-pluto-600 animate-pulse" />
                        <span className="text-sm font-medium text-pluto-700">Scanning receipt…</span>
                      </div>
                      <p className="text-xs text-gray-400">{receiptFile}</p>
                      <div className="mt-4 w-full bg-pluto-200 rounded-full h-1.5">
                        <div className="bg-pluto-600 h-1.5 rounded-full animate-pulse" style={{ width: '65%' }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Phase 2: connects to Google Vision OCR API</p>
                    </div>
                  )}

                  {ocrState === 'done' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Check size={14} className="text-green-600" />
                        <span className="text-sm text-green-700 font-medium">Parsed: {receiptFile}</span>
                        <span className="text-xs text-green-500 ml-auto">{ocrResult.length} items found</span>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Item</th>
                              <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Qty</th>
                              <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Unit Cost</th>
                              <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ocrResult.map((r, i) => (
                              <tr key={i} className="border-b border-gray-50">
                                <td className="px-4 py-2 font-medium text-gray-900">{r.description}</td>
                                <td className="px-4 py-2 text-gray-600">{r.qty}</td>
                                <td className="px-4 py-2 text-gray-600">{r.unitCost.toLocaleString()} CFA</td>
                                <td className="px-4 py-2 font-semibold text-gray-900">{r.total.toLocaleString()} CFA</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-gray-400">Review items above, then confirm to add to inventory. Set expiry dates and sell prices after import.</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setOcrState('idle'); setReceiptFile(null) }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Re-scan</button>
                        <button onClick={() => setShowAddStock(false)} className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Import to Inventory</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {addTab === 'insurance' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Upload and track insurance policies, business documents, and compliance certifications.</p>
                  {[
                    { icon: Shield, label: 'Goods in Transit Insurance', desc: 'Policy for inventory during delivery' },
                    { icon: FileText, label: 'Certificate of Incorporation', desc: 'Business registration document' },
                    { icon: DollarSign, label: 'Import/Export License', desc: 'Cross-border trade authorization' },
                  ].map(doc => (
                    <div key={doc.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <doc.icon size={16} className="text-pluto-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.label}</p>
                          <p className="text-xs text-gray-400">{doc.desc}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border border-pluto-200 text-pluto-600 rounded-lg text-xs font-medium hover:bg-pluto-50 transition-colors">
                        <Upload size={11} /> Upload
                      </button>
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Document Name</label>
                    <input placeholder="e.g. Goods in Transit Policy 2026" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Issue Date</label>
                      <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Expiry Date</label>
                      <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  </div>
                  <button onClick={() => setShowAddStock(false)} className="w-full px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 mt-2">Save Document</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
