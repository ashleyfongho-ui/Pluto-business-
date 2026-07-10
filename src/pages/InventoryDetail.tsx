import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Package, TrendingUp, TrendingDown, MapPin, Calendar, DollarSign, User, Megaphone } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useApp, businessTypeConfig } from '../context/AppContext'
import { inventory, campaigns, systemUsers } from '../data/mockData'

const locationColors: Record<string, string> = {
  'Warehouse': 'bg-blue-100 text-blue-700',
  'In Transit': 'bg-amber-100 text-amber-700',
  'At Market': 'bg-green-100 text-green-700',
}

function daysToExpiry(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default function InventoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { businessType } = useApp()
  const cfg = businessTypeConfig[businessType]
  const item = inventory.find(i => i.id === Number(id))
  const [tab, setTab] = useState<'overview' | 'batches' | 'campaigns'>('overview')

  if (!item) return (
    <><TopBar title="Item not found" /><main className="p-6"><p className="text-gray-400">Item not found.</p></main></>
  )

  const totalUnits = item.batches.reduce((s, b) => s + b.totalUnits, 0)
  const soldUnits = item.batches.reduce((s, b) => s + b.soldUnits, 0)
  const remaining = totalUnits - soldUnits
  const totalRevenue = item.batches.reduce((s, b) => s + b.soldUnits * b.sellPerUnit, 0)
  const totalCost = item.batches.reduce((s, b) => s + b.soldUnits * b.costPerUnit, 0)
  const grossProfit = totalRevenue - totalCost
  const marginPct = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0
  const isLow = remaining <= item.lowStockThreshold

  // Linked campaigns (any campaign with same name in title — mock logic)
  const linkedCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(item.name.split(' ')[0].toLowerCase()) ||
    item.name.toLowerCase().includes('paracetamol') // demo link
  )

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'batches', label: `Batches (${item.batches.length})` },
    { key: 'campaigns', label: `Campaigns (${linkedCampaigns.length})` },
  ] as const

  return (
    <>
      <TopBar title={item.name} />
      <main className="p-6 max-w-5xl">
        <button onClick={() => navigate('/inventory')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
          <ArrowLeft size={14} /> Back to {cfg.stockLabel}
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-pluto-100 text-pluto-700 flex items-center justify-center">
                <Package size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{item.name}</h1>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="font-mono text-xs text-pluto-600 bg-pluto-50 px-2 py-0.5 rounded">{item.sku}</span>
                  <span className="text-xs text-gray-400">{item.category}</span>
                  <span className="text-xs text-gray-400">{cfg.emoji} {cfg.label} mode</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              {isLow && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">Low Stock</span>}
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-5 gap-3 mt-5 pt-5 border-t border-gray-100">
            <div><p className="text-xs text-gray-400">{cfg.hasWeight ? 'Total bought' : 'Total units'}</p><p className="font-bold text-gray-900">{totalUnits.toLocaleString()} {cfg.unitLabel}</p></div>
            <div><p className="text-xs text-gray-400">Sold</p><p className="font-bold text-green-600">{soldUnits.toLocaleString()} {cfg.unitLabel}</p></div>
            <div><p className="text-xs text-gray-400">Remaining</p><p className={`font-bold ${isLow ? 'text-red-500' : 'text-gray-900'}`}>{remaining.toLocaleString()} {cfg.unitLabel}</p></div>
            <div><p className="text-xs text-gray-400">Revenue</p><p className="font-bold text-gray-900">{(totalRevenue / 1000).toFixed(0)}K CFA</p></div>
            <div><p className="text-xs text-gray-400">Gross margin</p>
              <p className={`font-bold ${marginPct >= 25 ? 'text-green-600' : marginPct >= 10 ? 'text-amber-600' : 'text-red-500'}`}>
                {marginPct}%
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t.key ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Financials</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} CFA`, color: 'text-green-600', icon: TrendingUp },
                  { label: 'Total Cost', value: `${totalCost.toLocaleString()} CFA`, color: 'text-red-500', icon: TrendingDown },
                  { label: 'Gross Profit', value: `${grossProfit.toLocaleString()} CFA`, color: 'text-pluto-700', icon: DollarSign },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <f.icon size={13} className={f.color} />
                      <span className="text-sm text-gray-600">{f.label}</span>
                    </div>
                    <span className={`font-bold text-sm ${f.color}`}>{f.value}</span>
                  </div>
                ))}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Margin</span><span className="font-bold text-gray-700">{marginPct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${marginPct >= 25 ? 'bg-green-500' : marginPct >= 10 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${marginPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Stock by Location</h3>
                {['Warehouse', 'In Transit', 'At Market'].map(loc => {
                  const locUnits = item.batches.filter(b => b.location === loc).reduce((s, b) => s + (b.totalUnits - b.soldUnits), 0)
                  return locUnits > 0 ? (
                    <div key={loc} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{loc}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${locationColors[loc]}`}>{locUnits} {cfg.unitLabel}</span>
                    </div>
                  ) : null
                })}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Price History</h3>
                <div className="space-y-2">
                  {item.batches.map(b => (
                    <div key={b.batchId} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-mono text-xs text-gray-400">{b.batchId}</p>
                        <p className="text-xs text-gray-500">{b.purchaseDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{b.costPerUnit.toLocaleString()} cost</p>
                        <p className="text-xs text-green-600 font-semibold">{b.sellPerUnit.toLocaleString()} sell</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BATCHES */}
        {tab === 'batches' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Batch</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Purchased</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Location</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Units</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Sold</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Remaining</th>
                  {cfg.hasExpiry && <th className="text-left px-4 py-3 font-medium text-gray-500">Expiry</th>}
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Cost → Sell</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Margin</th>
                </tr>
              </thead>
              <tbody>
                {item.batches.map(b => {
                  const bRemaining = b.totalUnits - b.soldUnits
                  const bMargin = b.sellPerUnit > 0 ? Math.round(((b.sellPerUnit - b.costPerUnit) / b.sellPerUnit) * 100) : 0
                  const bExp = cfg.hasExpiry ? daysToExpiry(b.expiryDate) : null
                  const bExpiring = bExp !== null && bExp <= 30 && bExp > 0
                  return (
                    <tr key={b.batchId} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-pluto-600">{b.batchId}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{b.purchaseDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${locationColors[b.location] || 'bg-gray-100 text-gray-600'}`}>
                          {b.location}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{b.totalUnits.toLocaleString()}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">{b.soldUnits.toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{bRemaining.toLocaleString()}</td>
                      {cfg.hasExpiry && (
                        <td className="px-4 py-3">
                          <span className={`text-xs ${bExpiring ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                            {b.expiryDate}{bExpiring ? ` (${bExp}d)` : ''}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-xs">
                        <span className="text-gray-500">{b.costPerUnit.toLocaleString()}</span>
                        <span className="text-gray-300 mx-1">→</span>
                        <span className="text-green-600 font-medium">{b.sellPerUnit.toLocaleString()} CFA</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${bMargin >= 25 ? 'bg-green-100 text-green-700' : bMargin >= 10 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                          {bMargin}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* CAMPAIGNS */}
        {tab === 'campaigns' && (
          <div className="space-y-3">
            {linkedCampaigns.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <Megaphone size={24} className="mx-auto text-gray-200 mb-2" />
                <p className="text-gray-400 text-sm">No campaigns linked to this product yet.</p>
                <Link to="/campaigns" className="text-pluto-600 text-xs font-medium hover:underline mt-1 block">Create a campaign →</Link>
              </div>
            ) : (
              linkedCampaigns.map(c => (
                <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.status === 'Active' ? 'bg-green-100 text-green-700' :
                      c.status === 'Completed' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'
                    }`}>{c.status}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      { label: 'Sent', value: c.sent },
                      { label: 'Opened', value: c.opened || 0 },
                      { label: 'Clicked', value: c.clicks || 0 },
                      { label: 'Channel', value: c.type },
                    ].map(m => (
                      <div key={m.label} className="bg-gray-50 rounded-lg p-2">
                        <p className="font-bold text-gray-900 text-sm">{m.value}</p>
                        <p className="text-xs text-gray-400">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  )
}
