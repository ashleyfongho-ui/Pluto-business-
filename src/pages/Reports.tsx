import { useState } from 'react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { useApp, businessTypeConfig } from '../context/AppContext'
import { inventory, deliveries, staff, leaveRequests, disciplinaryLog, campaigns } from '../data/mockData'
import { TrendingUp, TrendingDown, Minus, Download, Mail, MessageSquare, MousePointer, Eye, Users, BarChart2 } from 'lucide-react'

const dateRanges = ['This Week', 'This Month', 'Last Month', 'This Quarter']

function KPICard({ label, value, sub, color = 'text-gray-900', trend }: {
  label: string; value: string | number; sub?: string; color?: string; trend?: 'up' | 'down' | 'flat'
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">{label}</p>
      <div className="flex items-end justify-between">
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
            {trend === 'up' ? <TrendingUp size={13} /> : trend === 'down' ? <TrendingDown size={13} /> : <Minus size={13} />}
          </div>
        )}
      </div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function BarChart({ data, unit = '' }: { data: { label: string; value: number; color: string }[]; unit?: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-3 h-32 mt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500 font-medium">{d.value > 0 ? `${d.value}${unit}` : ''}</span>
          <div className="w-full rounded-t-lg transition-all" style={{ height: `${Math.max((d.value / max) * 88, d.value > 0 ? 4 : 0)}px`, background: d.color }} />
          <span className="text-xs text-gray-400 text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function ProgressRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 w-36 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-16 text-right">{value.toLocaleString()}</span>
    </div>
  )
}

export default function Reports() {
  const { t } = useLang()
  const { deals, invoices, organisations, contacts, businessType } = useApp()
  const cfg = businessTypeConfig[businessType]
  const [tab, setTab] = useState<'sales' | 'profitability' | 'inventory' | 'logistics' | 'staff' | 'pipeline' | 'campaigns'>('sales')
  const [range, setRange] = useState('This Month')

  // ─── Sales calcs ───────────────────────────────────────────────────────────
  const wonDeals = deals.filter(d => d.stage === 'Won')
  const lostDeals = deals.filter(d => d.stage === 'Lost')
  const closedDeals = wonDeals.length + lostDeals.length
  const winRate = closedDeals > 0 ? Math.round((wonDeals.length / closedDeals) * 100) : 0
  const wonValue = wonDeals.reduce((s, d) => s + d.value, 0)
  const paidInvoices = invoices.filter(i => i.status === 'paid')
  const overdueInvoices = invoices.filter(i => i.status === 'overdue')
  const invoiceRevenue = paidInvoices.reduce((s, i) => s + i.amount, 0)

  // ─── Inventory calcs ───────────────────────────────────────────────────────
  const totalSKUs = inventory.length
  const expiringItems = inventory.filter(i =>
    i.batches.some(b => { const d = (new Date(b.expiryDate).getTime() - Date.now()) / 86400000; return d <= 30 && d > 0 })
  )
  const lowStockItems = inventory.filter(i => {
    const total = i.batches.reduce((s, b) => s + b.totalUnits, 0)
    const sold = i.batches.reduce((s, b) => s + b.soldUnits, 0)
    return (total - sold) <= i.lowStockThreshold
  })
  const locationCounts = ['Warehouse', 'In Transit', 'At Market'].map(loc => ({
    label: loc, value: inventory.filter(i => i.batches.some(b => b.location === loc)).length,
    color: loc === 'Warehouse' ? '#3b82f6' : loc === 'In Transit' ? '#f59e0b' : '#10b981',
  }))
  const totalInventoryValue = inventory.reduce((s, i) =>
    s + i.batches.reduce((bs, b) => bs + (b.totalUnits - b.soldUnits) * b.sellPerUnit, 0), 0)

  // ─── Logistics calcs ───────────────────────────────────────────────────────
  const completed = deliveries.filter(d => d.status === 'Delivered')
  const inTransit = deliveries.filter(d => d.status === 'In Transit')
  const goodsValue = deliveries.reduce((s, d) => s + d.value, 0)
  const paidDeliveries = deliveries.filter(d => d.paymentReceived).reduce((s, d) => s + d.value, 0)

  // ─── Staff calcs ───────────────────────────────────────────────────────────
  const activeStaff = staff.filter(s => s.status === 'Active').length
  const onLeave = staff.filter(s => s.status === 'On Leave').length
  const deptCounts = [...new Set(staff.map(s => s.department))].map(dept => ({
    label: dept, value: staff.filter(s => s.department === dept).length,
    color: '#7c3aed',
  }))
  const pendingLeave = leaveRequests.filter(l => l.status === 'Pending').length
  const totalSalary = staff.reduce((s, m) => s + ((m as unknown as { salary?: number }).salary ?? 0), 0)

  // ─── Pipeline calcs ────────────────────────────────────────────────────────
  const pipelineValue = deals.filter(d => !['Won', 'Lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0)
  const avgDealAge = deals.length > 0 ? Math.round(deals.reduce((s, d) => s + d.age, 0) / deals.length) : 0
  const atRisk = deals.filter(d => d.age > 14 && !['Won', 'Lost'].includes(d.stage)).length
  const stageData = ['Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].map(stage => ({
    label: stage, value: Math.round(deals.filter(d => d.stage === stage).reduce((s, d) => s + d.value, 0) / 1000),
    color: stage === 'Won' ? '#10b981' : stage === 'Lost' ? '#ef4444' : stage === 'Negotiation' ? '#f59e0b' : stage === 'Proposal' ? '#8b5cf6' : '#3b82f6',
  }))

  // ─── Profitability calcs ─────────────────────────────────────────────────
  const productMargins = inventory.map(item => {
    const totalRevenue = item.batches.reduce((s, b) => s + b.soldUnits * b.sellPerUnit, 0)
    const totalCost = item.batches.reduce((s, b) => s + b.soldUnits * b.costPerUnit, 0)
    const margin = totalRevenue > 0 ? Math.round(((totalRevenue - totalCost) / totalRevenue) * 100) : 0
    const profit = totalRevenue - totalCost
    return { name: item.name, sku: item.sku, revenue: totalRevenue, cost: totalCost, profit, margin }
  }).sort((a, b) => b.profit - a.profit)

  // Revenue by staff (from deals owned)
  const staffRevenue = staff.map(s => {
    const ownedDeals = deals.filter(d => d.owner === `u${s.id}` && d.stage === 'Won')
    const revenue = ownedDeals.reduce((acc, d) => acc + d.value, 0)
    return { name: s.name, role: s.role, revenue, deals: ownedDeals.length }
  }).sort((a, b) => b.revenue - a.revenue)
  const maxStaffRevenue = staffRevenue[0]?.revenue || 1

  // Revenue by location (from organisations' won deals)
  const locationRevenue = (() => {
    const byCity: Record<string, number> = {}
    deals.filter(d => d.stage === 'Won').forEach(d => {
      const org = organisations.find(o => o.id === d.orgId)
      if (org) { byCity[org.city] = (byCity[org.city] || 0) + d.value }
    })
    return Object.entries(byCity).map(([city, revenue]) => ({ city, revenue })).sort((a,b) => b.revenue - a.revenue)
  })()
  const maxLocRevenue = locationRevenue[0]?.revenue || 1

  // Highest cost items
  const highestCostItems = [...productMargins].sort((a, b) => b.cost - a.cost)

  // ─── Campaign calcs ──────────────────────────────────────────────────────────────
  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0)
  const totalOpened = campaigns.reduce((s, c) => s + (c.opened || 0), 0)
  const totalClicks = campaigns.reduce((s, c) => s + (c.clicks || 0), 0)
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0
  const clickRate = totalOpened > 0 ? Math.round((totalClicks / totalOpened) * 100) : 0
  const conversionRate = totalClicks > 0 ? Math.round((wonDeals.length / totalClicks) * 100) : 0
  const bestCampaign = [...campaigns].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]

  // Business-type adapted inventory label
  const inventoryTabLabel = businessType === 'services' ? 'Capacity' : cfg.stockLabel

  const tabs = [
    { key: 'sales', label: 'Sales' },
    { key: 'profitability', label: 'Profitability' },
    { key: 'inventory', label: inventoryTabLabel },
    { key: 'logistics', label: 'Logistics', hidden: !cfg.showLogistics },
    { key: 'staff', label: 'Staff' },
    { key: 'pipeline', label: 'Pipeline' },
    { key: 'campaigns', label: 'Campaigns' },
  ] as const

  return (
    <>
      <TopBar title={t('reports')} />
      <main className="p-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {dateRanges.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${range === r ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={13} /> Export PDF
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {tabs.filter(t_ => !('hidden' in t_ && t_.hidden)).map(t_ => (
            <button key={t_.key} onClick={() => setTab(t_.key as typeof tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${tab === t_.key ? 'bg-pluto-600 text-white border-pluto-600 shadow-sm' : 'bg-white text-gray-600 border-gray-100 hover:border-pluto-200 hover:text-pluto-700'}`}>
              {t_.label}
            </button>
          ))}
        </div>

        {/* ─── SALES ─── */}
        {tab === 'sales' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <KPICard label="Revenue (Invoiced)" value={`${(invoiceRevenue / 1000).toFixed(0)}K CFA`} color="text-green-600" trend="up" />
              <KPICard label="Deals Won" value={wonDeals.length} sub={`${(wonValue / 1000).toFixed(0)}K CFA value`} color="text-green-600" />
              <KPICard label="Deals Lost" value={lostDeals.length} color="text-red-500" trend="down" />
              <KPICard label="Win Rate" value={`${winRate}%`} sub={`${closedDeals} deals closed`} color={winRate >= 50 ? 'text-green-600' : 'text-amber-600'} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Revenue by Organisation</h3>
                <p className="text-xs text-gray-400 mb-4">Paid invoices this period</p>
                <div className="space-y-3">
                  {organisations.slice(0, 5).map(org => {
                    const orgRevenue = paidInvoices.filter(i => i.orgId === org.id).reduce((s, i) => s + i.amount, 0)
                    return orgRevenue > 0 ? (
                      <ProgressRow key={org.id} label={org.name} value={orgRevenue} max={invoiceRevenue} color="#7c3aed" />
                    ) : null
                  }).filter(Boolean)}
                  {invoiceRevenue === 0 && <p className="text-sm text-gray-400 text-center py-4">No paid invoices yet</p>}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Invoice Summary</h3>
                <p className="text-xs text-gray-400 mb-4">All invoices by status</p>
                <div className="space-y-3">
                  {['paid', 'sent', 'overdue', 'draft'].map(status => {
                    const count = invoices.filter(i => i.status === status).length
                    const value = invoices.filter(i => i.status === status).reduce((s, i) => s + i.amount, 0)
                    const colors: Record<string, string> = { paid: '#10b981', sent: '#3b82f6', overdue: '#ef4444', draft: '#9ca3af' }
                    return (
                      <div key={status} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[status] }} />
                          <span className="text-sm text-gray-700 capitalize">{status}</span>
                          <span className="text-xs text-gray-400">({count})</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{(value / 1000).toFixed(0)}K CFA</span>
                      </div>
                    )
                  })}
                </div>
                {overdueInvoices.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600 font-semibold">⚠️ {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''} — {overdueInvoices.reduce((s, i) => s + i.amount, 0).toLocaleString()} CFA at risk</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">CRM Activity</h3>
              <p className="text-xs text-gray-400 mb-4">Organisation and contact health</p>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Organisations', value: organisations.length, sub: 'in CRM' },
                  { label: 'Total Contacts', value: contacts.length, sub: 'logged' },
                  { label: 'With Outstanding', value: organisations.filter(o => o.outstanding > 0).length, sub: 'orgs owe money' },
                  { label: 'Outstanding Total', value: `${(organisations.reduce((s, o) => s + o.outstanding, 0) / 1000).toFixed(0)}K CFA`, sub: 'accounts receivable' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── PROFITABILITY ─── */}
        {tab === 'profitability' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <KPICard label="Best Margin" value={`${productMargins[0]?.margin ?? 0}%`} sub={productMargins[0]?.name} color="text-green-600" trend="up" />
              <KPICard label="Total Gross Profit" value={`${(productMargins.reduce((s,p) => s+p.profit, 0)/1000).toFixed(0)}K CFA`} color="text-pluto-700" />
              <KPICard label="Top Earner" value={staffRevenue[0]?.name.split(' ')[0] ?? '—'} sub={staffRevenue[0] ? `${(staffRevenue[0].revenue/1000).toFixed(0)}K CFA won` : ''} color="text-pluto-700" />
            </div>

            {/* Margin by product */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Profit Margin by Product</h3>
              <p className="text-xs text-gray-400 mb-4">Based on cost vs sell price across all batches sold</p>
              <div className="space-y-3">
                {productMargins.map(p => (
                  <div key={p.sku} className="flex items-center gap-3">
                    <div className="w-32 shrink-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.sku}</p>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${Math.max(p.margin, 0)}%`, background: p.margin >= 30 ? '#10b981' : p.margin >= 15 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                    <div className="text-right w-32 shrink-0">
                      <span className={`text-sm font-bold ${p.margin >= 30 ? 'text-green-600' : p.margin >= 15 ? 'text-amber-600' : 'text-red-500'}`}>{p.margin}%</span>
                      <span className="text-xs text-gray-400 ml-2">{(p.profit/1000).toFixed(0)}K profit</span>
                    </div>
                  </div>
                ))}
                {productMargins.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No sold inventory data yet</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Revenue by staff */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Revenue by Staff Member</h3>
                <p className="text-xs text-gray-400 mb-4">Won deals attributed per person</p>
                <div className="space-y-3">
                  {staffRevenue.map(s => (
                    <div key={s.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-medium text-gray-900">{s.name}</span>
                          <span className="text-sm font-bold text-gray-900">{s.revenue > 0 ? `${(s.revenue/1000).toFixed(0)}K` : '—'} CFA</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-pluto-500" style={{ width: `${(s.revenue/maxStaffRevenue)*100}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{s.deals} deal{s.deals !== 1 ? 's' : ''} won</p>
                      </div>
                    </div>
                  ))}
                  {staffRevenue.every(s => s.revenue === 0) && <p className="text-sm text-gray-400 text-center py-4">No won deals yet</p>}
                </div>
              </div>

              {/* Revenue by location */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Revenue by Location</h3>
                <p className="text-xs text-gray-400 mb-4">City / market generating won deal value</p>
                {locationRevenue.length > 0 ? (
                  <div className="space-y-3">
                    {locationRevenue.map((l, i) => (
                      <div key={l.city} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 w-24 shrink-0">{l.city}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${(l.revenue/maxLocRevenue)*100}%`, background: ['#7c3aed','#5b21b6','#4c1d95','#2e1065'][i%4] }} />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-24 text-right">{(l.revenue/1000).toFixed(0)}K CFA</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No won deals yet</p>
                )}

                {/* Highest cost items */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Highest Cost Items</h4>
                  <div className="space-y-2">
                    {highestCostItems.slice(0,4).map(p => (
                      <div key={p.sku} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 truncate flex-1">{p.name}</span>
                        <span className="text-red-500 font-semibold ml-3">{(p.cost/1000).toFixed(0)}K CFA cost</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── INVENTORY ─── */}
        {tab === 'inventory' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <KPICard label="Total SKUs" value={totalSKUs} sub="active products" />
              <KPICard label="Expiring (30d)" value={expiringItems.length} color={expiringItems.length > 0 ? 'text-amber-600' : 'text-gray-900'} trend={expiringItems.length > 0 ? 'down' : 'flat'} />
              <KPICard label="Low Stock" value={lowStockItems.length} color={lowStockItems.length > 0 ? 'text-red-500' : 'text-gray-900'} />
              <KPICard label="Stock Value" value={`${(totalInventoryValue / 1000).toFixed(0)}K CFA`} color="text-pluto-700" trend="up" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">SKUs by Location</h3>
                <p className="text-xs text-gray-400 mb-2">Current stock distribution</p>
                <BarChart data={locationCounts} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Stock by SKU</h3>
                <p className="text-xs text-gray-400 mb-4">Remaining units across all batches</p>
                <div className="space-y-3">
                  {inventory.map(item => {
                    const total = item.batches.reduce((s, b) => s + b.totalUnits, 0)
                    const remaining = total - item.batches.reduce((s, b) => s + b.soldUnits, 0)
                    const isLow = remaining <= item.lowStockThreshold
                    return <ProgressRow key={item.id} label={item.name} value={remaining} max={total} color={isLow ? '#ef4444' : '#7c3aed'} />
                  })}
                </div>
              </div>
            </div>
            {expiringItems.length > 0 && (
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                <h3 className="font-semibold text-amber-800 mb-3">⚠️ Expiring Soon</h3>
                <div className="space-y-2">
                  {expiringItems.map(item =>
                    item.batches.filter(b => { const d = (new Date(b.expiryDate).getTime() - Date.now()) / 86400000; return d <= 30 && d > 0 }).map(batch => (
                      <div key={batch.batchId} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-amber-900">{item.name} — {batch.batchId}</span>
                        <span className="text-amber-700">{batch.expiryDate} · {batch.totalUnits - batch.soldUnits} units remaining</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── LOGISTICS ─── */}
        {tab === 'logistics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <KPICard label="Total Deliveries" value={deliveries.length} sub="this period" />
              <KPICard label="Completed" value={completed.length} color="text-green-600" trend="up" />
              <KPICard label="In Transit" value={inTransit.length} color="text-amber-600" />
              <KPICard label="Goods Value Moved" value={`${(goodsValue / 1000).toFixed(0)}K CFA`} color="text-pluto-700" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Deliveries by Status</h3>
                <BarChart data={['Preparing', 'In Transit', 'At Market', 'Delivered'].map(s => ({
                  label: s, value: deliveries.filter(d => d.status === s).length,
                  color: s === 'Delivered' ? '#10b981' : s === 'In Transit' ? '#f59e0b' : s === 'At Market' ? '#3b82f6' : '#9ca3af',
                }))} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Reconciliation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-600">Total dispatched</span>
                    <span className="font-semibold text-gray-900">{goodsValue.toLocaleString()} CFA</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-600">Payments received</span>
                    <span className="font-semibold text-green-600">{paidDeliveries.toLocaleString()} CFA</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-700">Outstanding</span>
                    <span className="font-bold text-amber-600">{(goodsValue - paidDeliveries).toLocaleString()} CFA</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${goodsValue > 0 ? (paidDeliveries / goodsValue) * 100 : 0}%` }} />
                  </div>
                  <p className="text-xs text-gray-400">{goodsValue > 0 ? Math.round((paidDeliveries / goodsValue) * 100) : 0}% collected</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── STAFF ─── */}
        {tab === 'staff' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <KPICard label="Headcount" value={staff.length} sub={`${activeStaff} active`} />
              <KPICard label="On Leave" value={onLeave} color={onLeave > 0 ? 'text-amber-600' : 'text-gray-900'} />
              <KPICard label="Leave Pending" value={pendingLeave} color={pendingLeave > 0 ? 'text-amber-600' : 'text-gray-900'} />
              <KPICard label="Disciplinary (YTD)" value={disciplinaryLog.length} color={disciplinaryLog.length > 0 ? 'text-red-500' : 'text-gray-900'} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Staff by Department</h3>
                <BarChart data={deptCounts.map((d, i) => ({ ...d, color: ['#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#2e1065'][i % 5] }))} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Leave Summary</h3>
                <div className="space-y-2">
                  {leaveRequests.map(l => (
                    <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{l.staff}</p>
                        <p className="text-xs text-gray-400">{l.type} · {l.from} → {l.to}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PIPELINE ─── */}
        {tab === 'pipeline' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <KPICard label="Pipeline Value" value={`${(pipelineValue / 1000).toFixed(0)}K CFA`} color="text-pluto-700" trend="up" />
              <KPICard label="Avg Deal Age" value={`${avgDealAge}d`} sub="across all deals" />
              <KPICard label="Win Rate" value={`${winRate}%`} color={winRate >= 50 ? 'text-green-600' : 'text-amber-600'} />
              <KPICard label="At Risk" value={atRisk} color={atRisk > 0 ? 'text-red-500' : 'text-gray-900'} sub=">14 days no activity" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Pipeline by Stage (K CFA)</h3>
                <BarChart data={stageData} unit="K" />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Deal Breakdown</h3>
                <div className="space-y-2">
                  {['Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].map(stage => {
                    const stageDeals = deals.filter(d => d.stage === stage)
                    const val = stageDeals.reduce((s, d) => s + d.value, 0)
                    const colors: Record<string, string> = { Qualified: '#3b82f6', Proposal: '#8b5cf6', Negotiation: '#f59e0b', Won: '#10b981', Lost: '#ef4444' }
                    return (
                      <div key={stage} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[stage] }} />
                          <span className="text-sm text-gray-700">{stage}</span>
                          <span className="text-xs text-gray-400">({stageDeals.length})</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{val > 0 ? `${(val / 1000).toFixed(0)}K CFA` : '—'}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            {atRisk > 0 && (
              <div className="bg-red-50 rounded-xl border border-red-200 p-5">
                <h3 className="font-semibold text-red-800 mb-3">🚨 Deals at Risk (stalled &gt;14 days)</h3>
                <div className="space-y-2">
                  {deals.filter(d => d.age > 14 && !['Won', 'Lost'].includes(d.stage)).map(d => (
                    <div key={d.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-red-900">{d.name}</span>
                      <span className="text-red-700">{d.age} days old · {(d.value / 1000).toFixed(0)}K CFA</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── CAMPAIGNS ─── */}
        {tab === 'campaigns' && (
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
              <KPICard label="Total Sent" value={totalSent.toLocaleString()} sub={`${campaigns.length} campaigns`} color="text-pluto-700" />
              <KPICard label="Open Rate" value={`${openRate}%`} sub={`${totalOpened.toLocaleString()} opened`} color={openRate >= 30 ? 'text-green-600' : 'text-amber-600'} trend={openRate >= 30 ? 'up' : 'flat'} />
              <KPICard label="Click-through Rate" value={`${clickRate}%`} sub={`${totalClicks} clicks`} color={clickRate >= 20 ? 'text-green-600' : 'text-amber-600'} trend={clickRate >= 20 ? 'up' : 'flat'} />
              <KPICard label="Conversion Rate" value={`${conversionRate}%`} sub="clicks → won deals" color={conversionRate > 0 ? 'text-pluto-700' : 'text-gray-500'} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Per campaign breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BarChart2 size={15} className="text-pluto-600" />Campaign Performance</h3>
                <div className="space-y-4">
                  {campaigns.map(c => {
                    const cOpenRate = c.sent > 0 ? Math.round(((c.opened || 0) / c.sent) * 100) : 0
                    const cClickRate = (c.opened || 0) > 0 ? Math.round(((c.clicks || 0) / (c.opened || 1)) * 100) : 0
                    const typeIcon = c.type === 'WhatsApp' ? MessageSquare : c.type === 'Email' ? Mail : Users
                    const TypeIcon = typeIcon
                    return (
                      <div key={c.id} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon size={13} className={c.type === 'WhatsApp' ? 'text-green-600' : 'text-blue-600'} />
                            <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            c.status === 'Active' ? 'bg-green-100 text-green-700' :
                            c.status === 'Completed' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'
                          }`}>{c.status}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {[
                            { label: 'Sent', value: c.sent, icon: Mail },
                            { label: 'Opened', value: c.opened || 0, pct: cOpenRate, icon: Eye },
                            { label: 'Clicked', value: c.clicks || 0, pct: cClickRate, icon: MousePointer },
                            { label: 'Responses', value: Math.round((c.opened || 0) * 0.12), pct: Math.round(((c.opened || 0) * 0.12 / Math.max(c.sent,1)) * 100), icon: Users },
                          ].map(m => (
                            <div key={m.label} className="bg-gray-50 rounded-lg p-2">
                              <p className="text-lg font-bold text-gray-900">{m.value}</p>
                              {m.pct !== undefined && <p className="text-xs text-pluto-600 font-semibold">{m.pct}%</p>}
                              <p className="text-xs text-gray-400">{m.label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-0.5">
                            <span>Open rate</span><span>{cOpenRate}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-pluto-500" style={{ width: `${cOpenRate}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Channel comparison + response rates */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Performance by Channel</h3>
                  {(['Email', 'WhatsApp'] as const).map(channel => {
                    const chCampaigns = campaigns.filter(c => c.type === 'WhatsApp' ? channel === 'WhatsApp' : channel === 'Email')
                    const chSent = chCampaigns.reduce((s, c) => s + c.sent, 0)
                    const chOpened = chCampaigns.reduce((s, c) => s + (c.opened || 0), 0)
                    const chClicks = chCampaigns.reduce((s, c) => s + (c.clicks || 0), 0)
                    const chOpen = chSent > 0 ? Math.round((chOpened / chSent) * 100) : 0
                    const chClick = chOpened > 0 ? Math.round((chClicks / chOpened) * 100) : 0
                    return (
                      <div key={channel} className={`p-4 rounded-xl border mb-3 ${
                        channel === 'WhatsApp' ? 'border-green-100 bg-green-50' : 'border-blue-100 bg-blue-50'
                      }`}>
                        <div className="flex items-center gap-2 mb-3">
                          {channel === 'WhatsApp' ? <MessageSquare size={14} className="text-green-600" /> : <Mail size={14} className="text-blue-600" />}
                          <p className="font-semibold text-gray-900 text-sm">{channel}</p>
                          <span className="text-xs text-gray-400 ml-auto">{chCampaigns.length} campaign{chCampaigns.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div><p className="font-bold text-gray-900">{chSent}</p><p className="text-xs text-gray-400">Sent</p></div>
                          <div><p className="font-bold text-gray-900">{chOpen}%</p><p className="text-xs text-gray-400">Open rate</p></div>
                          <div><p className="font-bold text-gray-900">{chClick}%</p><p className="text-xs text-gray-400">CTR</p></div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Conversion Funnel</h3>
                  {[
                    { label: 'Sent', value: totalSent, color: '#7c3aed' },
                    { label: 'Opened', value: totalOpened, color: '#6d28d9' },
                    { label: 'Clicked', value: totalClicks, color: '#4c1d95' },
                    { label: 'Responded', value: Math.round(totalClicks * 0.35), color: '#2e1065' },
                    { label: 'Won Deal', value: wonDeals.length, color: '#10b981' },
                  ].map((step, i, arr) => {
                    const pct = arr[0].value > 0 ? Math.round((step.value / arr[0].value) * 100) : 0
                    return (
                      <div key={step.label} className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-gray-500 w-20 shrink-0">{step.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                          <div className="h-4 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max(pct, 2)}%`, background: step.color }}>
                            <span className="text-xs text-white font-semibold">{step.value}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8">{pct}%</span>
                      </div>
                    )
                  })}
                  <p className="text-xs text-gray-400 mt-2">End-to-end funnel from send → won deal</p>
                </div>

                {bestCampaign && (
                  <div className="bg-pluto-50 rounded-xl border border-pluto-100 p-4">
                    <p className="text-xs font-semibold text-pluto-700 mb-1">🏆 Best Performing</p>
                    <p className="font-semibold text-gray-900">{bestCampaign.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{bestCampaign.clicks || 0} clicks · {bestCampaign.type} · {bestCampaign.status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
