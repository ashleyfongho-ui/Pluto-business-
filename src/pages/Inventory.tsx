import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { useApp } from '../context/AppContext'
import { businessTypeConfig } from '../context/AppContext'
import { inventory, systemUsers } from '../data/mockData'
import {
  AlertTriangle, Package, Truck, Plus, ChevronDown, ChevronRight,
  Upload, Scan, X, Check, Shield, FileText, DollarSign, Leaf,
  Clock, Layers, Wrench, Info, Barcode, Printer, Search
} from 'lucide-react'
import BarcodeModal from '../components/BarcodeModal'

function daysToExpiry(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

const locationColors: Record<string, string> = {
  'Warehouse': 'bg-blue-100 text-blue-700',
  'In Transit': 'bg-amber-100 text-amber-700',
  'At Market': 'bg-green-100 text-green-700',
}

// ─── Mode badge ───────────────────────────────────────────────────────────────
const modeBadge: Record<string, { icon: React.ElementType; color: string }> = {
  pharma:        { icon: Package,  color: 'bg-blue-100 text-blue-700' },
  produce:       { icon: Leaf,     color: 'bg-green-100 text-green-700' },
  retail:        { icon: Layers,   color: 'bg-violet-100 text-violet-700' },
  services:      { icon: Clock,    color: 'bg-amber-100 text-amber-700' },
  manufacturing: { icon: Wrench,   color: 'bg-gray-100 text-gray-700' },
}

export default function Inventory() {
  const { t } = useLang()
  const { businessType } = useApp()
  const cfg = businessTypeConfig[businessType]
  const navigate = useNavigate()

  const [filter, setFilter] = useState<'all' | 'expiring' | 'low' | 'transit' | 'waste'>('all')
  const [inventorySearch, setInventorySearch] = useState('')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [showAddStock, setShowAddStock] = useState(false)
  const [barcodeItem, setBarcodeItem] = useState<{sku: string; name: string} | null>(null)
  const [addTab, setAddTab] = useState<'manual' | 'receipt' | 'insurance' | 'dailyrec'>('manual')
  const [ocrState, setOcrState] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [receiptFile, setReceiptFile] = useState<string | null>(null)
  const [showDailyRec, setShowDailyRec] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const expiringItems = inventory.filter(i =>
    i.batches.some(b => { const d = daysToExpiry(b.expiryDate); return d <= 30 && d > 0 })
  )
  const lowStockItems = inventory.filter(i => {
    const total = i.batches.reduce((s, b) => s + b.totalUnits, 0)
    const sold = i.batches.reduce((s, b) => s + b.soldUnits, 0)
    return (total - sold) <= i.lowStockThreshold
  })
  const inTransitItems = inventory.filter(i => i.batches.some(b => b.location === 'In Transit'))

  const baseFiltered = filter === 'expiring' ? expiringItems
    : filter === 'low' ? lowStockItems
    : filter === 'transit' ? inTransitItems
    : inventory
  const filtered = inventorySearch
    ? baseFiltered.filter(i =>
        i.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        i.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        i.category.toLowerCase().includes(inventorySearch.toLowerCase())
      )
    : baseFiltered

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const ocrResult = [
    { description: 'Paracetamol 500mg (x500)', qty: 500, unitCost: 450, total: 225000 },
    { description: 'Amoxicillin 250mg (x100)', qty: 100, unitCost: 1200, total: 120000 },
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReceiptFile(file.name)
    setOcrState('scanning')
    setTimeout(() => setOcrState('done'), 2800)
  }

  const ModeIcon = modeBadge[businessType].icon

  return (
    <>
      <TopBar title={t('inventory')} />
      <main className="p-6">

        {/* Mode banner */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-5 ${modeBadge[businessType].color} border-current/20`}>
          <ModeIcon size={16} />
          <div className="flex-1">
            <span className="font-semibold text-sm">{cfg.emoji} {cfg.label} Mode</span>
            <span className="text-xs ml-2 opacity-70">— {cfg.description}</span>
          </div>
          <span className="text-xs opacity-60">Change in Settings → Business Type</span>
        </div>

        {/* Alert / filter strip */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {cfg.hasExpiry && (
            <button onClick={() => setFilter(filter === 'expiring' ? 'all' : 'expiring')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all border-amber-200 bg-amber-50 text-amber-700 ${filter === 'expiring' ? 'ring-2 ring-offset-1 ring-pluto-400' : 'opacity-80 hover:opacity-100'}`}>
              <AlertTriangle size={14} />{expiringItems.length} expiring soon
            </button>
          )}
          <button onClick={() => setFilter(filter === 'low' ? 'all' : 'low')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all border-red-200 bg-red-50 text-red-700 ${filter === 'low' ? 'ring-2 ring-offset-1 ring-pluto-400' : 'opacity-80 hover:opacity-100'}`}>
            <Package size={14} />{lowStockItems.length} low {businessType === 'services' ? 'capacity' : 'stock'}
          </button>
          {cfg.showLogistics && (
            <button onClick={() => setFilter(filter === 'transit' ? 'all' : 'transit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all border-blue-200 bg-blue-50 text-blue-700 ${filter === 'transit' ? 'ring-2 ring-offset-1 ring-pluto-400' : 'opacity-80 hover:opacity-100'}`}>
              <Truck size={14} />{inTransitItems.length} in transit
            </button>
          )}
          {cfg.hasWaste && (
            <button onClick={() => setShowDailyRec(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all border-green-200 bg-green-50 text-green-700 hover:opacity-100">
              <Leaf size={14} /> Daily Reconciliation
            </button>
          )}
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="text-xs text-gray-400 hover:text-gray-600 self-center ml-1">Clear ×</button>
          )}
        </div>

        {/* Main table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={inventorySearch} onChange={e => setInventorySearch(e.target.value)}
                placeholder="Search inventory…"
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 w-44" />
            </div>
            <p className="text-sm text-gray-500">{filtered.length} {cfg.itemLabel.toLowerCase()}{filtered.length !== 1 ? 's' : ''}</p>
            <div className="flex items-center gap-2 ml-auto">

              <button onClick={() => { setShowAddStock(true); setOcrState('idle'); setReceiptFile(null) }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                <Plus size={13} /> {businessType === 'services' ? 'Add Service' : businessType === 'produce' ? 'Add Produce' : `Add ${cfg.itemLabel}`}
              </button>
            </div>
          </div>

          {/* Services mode — different layout */}
          {businessType === 'services' ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Service</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Unit</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Rate / Unit</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Cost / Unit</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Capacity</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Utilisation</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: 'Site Survey', unit: 'hours', rate: 15000, cost: 8000, capacity: 80, used: 56, assignedTo: 'Fabrice Mvondo' },
                  { id: 2, name: 'Device Installation', unit: 'sessions', rate: 45000, cost: 25000, capacity: 20, used: 14, assignedTo: 'Christelle Abena' },
                  { id: 3, name: 'Monthly Maintenance', unit: 'jobs', rate: 35000, cost: 18000, capacity: 40, used: 22, assignedTo: 'Bruno Manga' },
                ].map(s => {
                  const util = Math.round((s.used / s.capacity) * 100)
                  return (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{s.unit}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{s.rate.toLocaleString()} CFA</td>
                      <td className="px-4 py-3 text-gray-500">{s.cost.toLocaleString()} CFA</td>
                      <td className="px-4 py-3 text-gray-700">{s.used}/{s.capacity} {s.unit}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${util >= 80 ? 'bg-red-400' : util >= 60 ? 'bg-amber-400' : 'bg-pluto-500'}`}
                              style={{ width: `${util}%` }} />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{util}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{s.assignedTo}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="w-8 px-4 py-3"></th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">SKU</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{cfg.itemLabel}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Batches</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Total {cfg.unitLabel}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Remaining</th>
                  {cfg.hasWaste && <th className="text-left px-4 py-3 font-medium text-gray-500">Waste</th>}
                  {cfg.hasVariants && <th className="text-left px-4 py-3 font-medium text-gray-500">Variants</th>}
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const totalUnits = item.batches.reduce((s, b) => s + b.totalUnits, 0)
                  const soldUnits = item.batches.reduce((s, b) => s + b.soldUnits, 0)
                  const remaining = totalUnits - soldUnits
                  const isLow = remaining <= item.lowStockThreshold
                  const isExpiring = cfg.hasExpiry && item.batches.some(b => { const d = daysToExpiry(b.expiryDate); return d <= 30 && d > 0 })
                  const hasTransit = item.batches.some(b => b.location === 'In Transit')
                  const isExpanded = expanded.has(item.id)
                  // Simulate waste for produce/manufacturing
                  const wasteUnits = cfg.hasWaste ? Math.floor(totalUnits * 0.04) : 0

                  return (
                    <>
                      <tr key={item.id}
                        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-3 text-gray-400" onClick={() => toggleExpand(item.id)}>
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-pluto-600 underline decoration-dotted" onClick={() => navigate(`/inventory/${item.id}`)}>{item.sku}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 group-hover:text-pluto-700" onClick={() => navigate(`/inventory/${item.id}`)}>{item.name}</td>
                        <td className="px-4 py-3 text-gray-500">{item.category}</td>
                        <td className="px-4 py-3 text-gray-500">{item.batches.length}</td>
                        <td className="px-4 py-3 text-gray-900 font-medium">{totalUnits.toLocaleString()} {cfg.unitLabel}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>{remaining.toLocaleString()}</span>
                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${isLow ? 'bg-red-400' : 'bg-pluto-500'}`}
                                style={{ width: `${totalUnits > 0 ? Math.min(100, (remaining / totalUnits) * 100) : 0}%` }} />
                            </div>
                          </div>
                        </td>
                        {cfg.hasWaste && (
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium ${wasteUnits > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                              {wasteUnits} {cfg.unitLabel}
                            </span>
                          </td>
                        )}
                        {cfg.hasVariants && (
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">S/M/L/XL</span>
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap items-center">
                            {isLow && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded font-medium">Low</span>}
                            {isExpiring && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-xs rounded font-medium">Exp</span>}
                            {hasTransit && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded font-medium">Transit</span>}
                            <button
                              onClick={e => { e.stopPropagation(); setBarcodeItem({ sku: item.sku, name: item.name }) }}
                              className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 flex items-center gap-0.5">
                              <Barcode size={10} /> Barcode
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded batch rows */}
                      {isExpanded && item.batches.map(batch => {
                        const batchRemaining = batch.totalUnits - batch.soldUnits
                        const bExp = daysToExpiry(batch.expiryDate)
                        const bExpiring = cfg.hasExpiry && bExp <= 30 && bExp > 0
                        const margin = batch.sellPerUnit > 0
                          ? Math.round(((batch.sellPerUnit - batch.costPerUnit) / batch.sellPerUnit) * 100)
                          : 0
                        return (
                          <tr key={batch.batchId} className="bg-pluto-50/40 border-b border-gray-100">
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-400">{batch.batchId}</td>
                            <td className="px-4 py-2 text-xs text-gray-500">Purchased {batch.purchaseDate}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${locationColors[batch.location] || 'bg-gray-100 text-gray-600'}`}>
                                {batch.location}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-500">{batch.soldUnits}/{batch.totalUnits} {cfg.unitLabel} sold</td>
                            <td className="px-4 py-2 text-xs">
                              {cfg.hasExpiry ? (
                                <span className={bExpiring ? 'text-amber-600 font-medium' : 'text-gray-400'}>
                                  Exp: {batch.expiryDate}{bExpiring ? ` (${bExp}d)` : ''}
                                </span>
                              ) : (
                                <span className="text-gray-400">{batchRemaining} remaining</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-xs">
                              <span className="text-gray-500">{batch.costPerUnit.toLocaleString()} cost</span>
                              <span className="text-gray-400 mx-1">→</span>
                              <span className="text-green-600 font-medium">{batch.sellPerUnit.toLocaleString()} sell</span>
                              <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs font-semibold ${margin >= 25 ? 'bg-green-100 text-green-700' : margin >= 10 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                                {margin}% margin
                              </span>
                            </td>
                            {cfg.hasWaste && <td className="px-4 py-2"></td>}
                            {cfg.hasVariants && <td className="px-4 py-2 text-xs text-gray-400">—</td>}
                            <td className="px-4 py-2"></td>
                          </tr>
                        )
                      })}
                    </>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add Stock / Service Modal */}
      {showAddStock && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">
                  {businessType === 'services' ? 'Add Service' : businessType === 'produce' ? 'Add Produce Batch' : `Add ${cfg.itemLabel}`}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{cfg.emoji} {cfg.label} mode</p>
              </div>
              <button onClick={() => setShowAddStock(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {/* Tab bar — context-aware */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mx-6 mt-4 mb-4">
              {businessType === 'services' ? (
                <button className="flex-1 px-2 py-1.5 rounded-md text-xs font-medium bg-white shadow text-pluto-700">Service Details</button>
              ) : (
                <>
                  <button onClick={() => setAddTab('manual')}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${addTab === 'manual' ? 'bg-white shadow text-pluto-700' : 'text-gray-500'}`}>
                    Manual Entry
                  </button>
                  <button onClick={() => setAddTab('receipt')}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${addTab === 'receipt' ? 'bg-white shadow text-pluto-700' : 'text-gray-500'}`}>
                    Upload Receipt
                  </button>
                  {cfg.hasWaste && (
                    <button onClick={() => setAddTab('dailyrec')}
                      className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${addTab === 'dailyrec' ? 'bg-white shadow text-pluto-700' : 'text-gray-500'}`}>
                      Daily Rec
                    </button>
                  )}
                  <button onClick={() => setAddTab('insurance')}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${addTab === 'insurance' ? 'bg-white shadow text-pluto-700' : 'text-gray-500'}`}>
                    Docs
                  </button>
                </>
              )}
            </div>

            <div className="px-6 pb-6">
              {/* SERVICES mode form */}
              {businessType === 'services' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Service Name</label>
                    <input placeholder="e.g. Site Survey, Monthly Maintenance" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Billing Unit</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                        {cfg.unitOptions.map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Monthly Capacity</label>
                      <input type="number" placeholder="e.g. 80 hours" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Cost / Unit (CFA)</label>
                      <input type="number" placeholder="Staff cost rate" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Sell Rate / Unit</label>
                      <input type="number" placeholder="Client billing rate" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Assigned To</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                      {systemUsers.map(u => <option key={u.id}>{u.name} — {u.role}</option>)}
                    </select>
                  </div>
                  <button onClick={() => setShowAddStock(false)} className="w-full py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Add Service</button>
                </div>
              )}

              {/* MANUAL ENTRY (non-services) */}
              {businessType !== 'services' && addTab === 'manual' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">{cfg.itemLabel} Name</label>
                      <input placeholder={businessType === 'produce' ? 'e.g. Plantains' : 'Product name'} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Supplier / Source</label>
                      <input placeholder="Supplier or market name" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Qty Purchased</label>
                      <div className="flex gap-1">
                        <input type="number" placeholder="0" className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                        <select className="border border-gray-200 rounded-lg px-1 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-pluto-300">
                          {cfg.unitOptions.map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Cost / {cfg.unitLabel} (CFA)</label>
                      <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Sell / {cfg.unitLabel}</label>
                      <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Purchase Date</label>
                      <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                    {cfg.hasExpiry ? (
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Expiry Date</label>
                        <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                      </div>
                    ) : cfg.hasWaste ? (
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Expected Sell-by (days)</label>
                        <input type="number" placeholder="e.g. 5 days" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                      </div>
                    ) : (
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Reorder Point</label>
                        <input type="number" placeholder="Alert when below…" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                      </div>
                    )}
                  </div>
                  {cfg.hasVariants && (
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Variants (sizes, colours)</label>
                      <input placeholder="e.g. S:20, M:35, L:30, XL:15" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                      <p className="text-xs text-gray-400 mt-0.5">Format: Variant:qty, separated by commas</p>
                    </div>
                  )}
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

              {/* DAILY RECONCILIATION (produce/manufacturing) */}
              {addTab === 'dailyrec' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                    <Info size={14} className="text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-700">Log what was sold, wasted, and what cash came in. Do this at end of each market day.</p>
                  </div>
                  {inventory.slice(0, 3).map(item => (
                    <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4">
                      <p className="font-medium text-gray-900 text-sm mb-3">{item.name} <span className="text-xs text-gray-400">({item.sku})</span></p>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Sold ({cfg.unitLabel})</label>
                          <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block text-amber-600">Wasted ({cfg.unitLabel})</label>
                          <input type="number" placeholder="0" className="w-full border border-amber-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Cash In (CFA)</label>
                          <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddStock(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                    <button onClick={() => setShowAddStock(false)} className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Save Daily Rec</button>
                  </div>
                </div>
              )}

              {/* RECEIPT / OCR */}
              {addTab === 'receipt' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Upload a supplier receipt or invoice. Items and quantities will be parsed automatically.</p>
                  {ocrState === 'idle' && (
                    <div onClick={() => fileRef.current?.click()}
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
                      <div className="flex gap-2">
                        <button onClick={() => { setOcrState('idle'); setReceiptFile(null) }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Re-scan</button>
                        <button onClick={() => setShowAddStock(false)} className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Import to Inventory</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* INSURANCE / DOCS */}
              {addTab === 'insurance' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Track insurance policies, business documents, and compliance certifications.</p>
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
                  <button onClick={() => setShowAddStock(false)} className="w-full px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 mt-2">Save Document</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Barcode Modal */}
      {barcodeItem && (
        <BarcodeModal sku={barcodeItem.sku} name={barcodeItem.name} onClose={() => setBarcodeItem(null)} />
      )}

      {/* Daily Rec modal shortcut (from filter strip) */}
      {showDailyRec && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Daily Reconciliation</h3>
                <p className="text-xs text-gray-400">Log today's sales, waste, and cash</p>
              </div>
              <button onClick={() => setShowDailyRec(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {inventory.map(item => (
                <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="font-medium text-gray-900 text-sm mb-3">{item.name}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Sold ({cfg.unitLabel})</label>
                      <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <label className="text-xs text-amber-600 mb-1 block">Wasted</label>
                      <input type="number" placeholder="0" className="w-full border border-amber-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Cash In (CFA)</label>
                      <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowDailyRec(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              <button onClick={() => setShowDailyRec(false)} className="flex-1 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Save & Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
