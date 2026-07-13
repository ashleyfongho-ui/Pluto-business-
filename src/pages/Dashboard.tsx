import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, GitBranch, Trophy, Activity, AlertTriangle, Clock,
  Package, Plus, Building2, User, FileText, Calendar, ChevronRight,
  CheckCircle2, Bell
} from 'lucide-react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { useApp } from '../context/AppContext'
import { inventory } from '../data/mockData'
import NewOrganisationModal from '../components/NewOrganisationModal'
import NewContactModal from '../components/NewContactModal'
import NewDealModal from '../components/NewDealModal'

const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const stageColors: Record<string, string> = {
  Qualified: 'bg-blue-100 text-blue-700',
  Proposal: 'bg-purple-100 text-purple-700',
  Negotiation: 'bg-amber-100 text-amber-700',
  Won: 'bg-green-100 text-green-700',
  Lost: 'bg-red-100 text-red-700',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useLang()
  const { deals, invoices, organisations, contacts } = useApp()
  const [modal, setModal] = useState<'org' | 'contact' | 'deal' | null>(null)

  const now = new Date()
  const currentMonthName = now.toLocaleString('en-GB', { month: 'long' })
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const openDeals = deals.filter(d => !['Won', 'Lost'].includes(d.stage)).length
  const pipelineValue = deals.filter(d => !['Won', 'Lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0)
  const wonThisMonth = deals.filter(d => {
    if (d.stage !== 'Won' || !d.closedAt) return false
    const closed = new Date(d.closedAt)
    return closed.getFullYear() === currentYear && closed.getMonth() === currentMonth
  }).reduce((s, d) => s + d.value, 0)
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length
  const expiringItems = inventory.filter(i =>
    i.batches.some(b => { const d = (new Date(b.expiryDate).getTime() - Date.now()) / 86400000; return d <= 30 && d > 0 })
  ).length
  const lowStockItems = inventory.filter(i => {
    const total = i.batches.reduce((s, b) => s + b.totalUnits, 0)
    const sold = i.batches.reduce((s, b) => s + b.soldUnits, 0)
    return (total - sold) <= i.lowStockThreshold
  }).length

  const todayStr = new Date().toISOString().split('T')[0]
  const upcomingReminders = deals.flatMap(d =>
    (d.reminders || [])
      .filter(r => r.date <= todayStr)
      .map(r => ({ ...r, dealName: d.name, dealId: d.id, orgName: organisations.find(o => o.id === d.orgId)?.name || '' }))
  ).slice(0, 5)

  const stats = [
    { label: t('open deals'), value: openDeals, icon: GitBranch, color: 'bg-pluto-100 text-pluto-700', route: '/pipeline' },
    { label: t('pipeline value'), value: `${(pipelineValue / 1000).toFixed(0)}K CFA`, icon: TrendingUp, color: 'bg-violet-100 text-violet-700', route: '/pipeline' },
    { label: `Won in ${currentMonthName}`, value: `${(wonThisMonth / 1000).toFixed(0)}K CFA`, icon: Trophy, color: 'bg-green-100 text-green-700', route: '/pipeline' },
    { label: 'Total Contacts', value: contacts.length, icon: Activity, color: 'bg-blue-100 text-blue-700', route: '/contacts' },
  ]

  const alerts = [
    overdueInvoices > 0 && { icon: Clock, label: `${overdueInvoices} overdue invoice${overdueInvoices > 1 ? 's' : ''}`, color: 'text-red-600 bg-red-50 border border-red-100', route: '/invoices' },
    expiringItems > 0 && { icon: AlertTriangle, label: `${expiringItems} item${expiringItems > 1 ? 's' : ''} expiring in 30 days`, color: 'text-amber-600 bg-amber-50 border border-amber-100', route: '/inventory' },
    lowStockItems > 0 && { icon: Package, label: `${lowStockItems} item${lowStockItems > 1 ? 's' : ''} low on stock`, color: 'text-orange-600 bg-orange-50 border border-orange-100', route: '/inventory' },
  ].filter(Boolean) as { icon: React.ElementType; label: string; color: string; route: string }[]

  return (
    <>
      <TopBar title="Dashboard" />
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">{today}</p>
          {/* Quick actions */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Quick add:</span>
            {[
              { icon: Building2, label: 'Organisation', action: () => setModal('org'), color: 'hover:bg-pluto-50 hover:text-pluto-700 hover:border-pluto-300' },
              { icon: User, label: 'Contact', action: () => setModal('contact'), color: 'hover:bg-green-50 hover:text-green-700 hover:border-green-300' },
              { icon: GitBranch, label: 'Deal', action: () => setModal('deal'), color: 'hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300' },
            ].map(btn => (
              <button key={btn.label} onClick={btn.action}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium transition-all ${btn.color}`}>
                <Plus size={13} />
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alert strip */}
        {alerts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {alerts.map((a, i) => (
              <button key={i} onClick={() => navigate(a.route)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${a.color} hover:opacity-80 transition-opacity cursor-pointer`}>
                <a.icon size={13} />
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <button key={s.label} onClick={() => navigate(s.route)}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-left hover:shadow-md hover:border-pluto-200 transition-all cursor-pointer group">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-pluto-700 transition-colors">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent deals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Deals</h2>
              <button onClick={() => navigate('/pipeline')} className="text-xs text-pluto-600 hover:text-pluto-800 font-medium flex items-center gap-1">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {deals.slice(0, 4).map(d => (
                <button key={d.id} onClick={() => navigate(`/pipeline/${d.id}`)}
                  className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-1.5 -mx-1.5 transition-colors">
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{d.name}</p>
                    <p className="text-xs text-gray-400">{organisations.find(o => o.id === d.orgId)?.name || '—'}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-semibold text-gray-900">{(d.value / 1000).toFixed(0)}K</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${stageColors[d.stage] || 'bg-gray-100 text-gray-600'}`}>{d.stage}</span>
                  </div>
                </button>
              ))}
              <button onClick={() => setModal('deal')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 hover:border-pluto-300 hover:text-pluto-600 transition-colors">
                <Plus size={13} /> New Deal
              </button>
            </div>
          </div>

          {/* Invoice status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Invoice Status</h2>
              <button onClick={() => navigate('/invoices')} className="text-xs text-pluto-600 hover:text-pluto-800 font-medium flex items-center gap-1">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {invoices.slice(0, 4).map(inv => (
                <button key={inv.id} onClick={() => navigate('/invoices')}
                  className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-1.5 -mx-1.5 transition-colors">
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900">{inv.id}</p>
                    <p className="text-xs text-gray-400 truncate">{organisations.find(o => o.id === inv.orgId)?.name || '—'}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-semibold text-gray-900">{inv.amount.toLocaleString()}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                      inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      inv.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{inv.status}</span>
                  </div>
                </button>
              ))}
              <button onClick={() => navigate('/invoices')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 hover:border-pluto-300 hover:text-pluto-600 transition-colors">
                <FileText size={13} /> Manage Invoices
              </button>
            </div>
          </div>

          {/* Tasks & Reminders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell size={15} className="text-pluto-500" /> Tasks & Reminders
              </h2>
              <button onClick={() => navigate('/pipeline')} className="text-xs text-pluto-600 hover:text-pluto-800 font-medium flex items-center gap-1">
                Pipeline <ChevronRight size={12} />
              </button>
            </div>
            {upcomingReminders.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 size={28} className="text-green-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-medium">All clear!</p>
                <p className="text-xs text-gray-300">No overdue tasks today</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingReminders.map((r, i) => (
                  <button key={i} onClick={() => navigate(`/pipeline/${r.dealId}`)}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors">
                    <Calendar size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{r.note}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.dealName} · {r.orgName}</p>
                      <p className="text-xs text-amber-600 mt-0.5">Due {r.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent activity — derived from live data */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Activity</p>
              <div className="space-y-2">
                {[
                  ...invoices.filter(i => i.status === 'paid').map(i => ({
                    icon: '✅',
                    text: `${i.id} marked paid`,
                    sub: organisations.find(o => o.id === i.orgId)?.name || '—',
                    time: i.paidAt ? new Date(i.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'recently',
                  })),
                  ...deals.filter(d => d.stage === 'Proposal').map(d => ({
                    icon: '📋',
                    text: `Proposal: ${d.name}`,
                    sub: organisations.find(o => o.id === d.orgId)?.name || '—',
                    time: `${d.age}d ago`,
                  })),
                  ...contacts.slice(0, 2).map(c => ({
                    icon: '💬',
                    text: `Last contact: ${c.name}`,
                    sub: organisations.find(o => o.id === c.orgId)?.name || '—',
                    time: c.lastContact,
                  })),
                ].slice(0, 4).map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{a.text}</p>
                      <p className="text-xs text-gray-400">{a.sub}</p>
                    </div>
                    <span className="text-xs text-gray-300 shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Org overview strip */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Organisations Overview</h2>
            <button onClick={() => navigate('/organisations')} className="text-xs text-pluto-600 hover:text-pluto-800 font-medium flex items-center gap-1">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {organisations.slice(0, 5).map(o => (
              <button key={o.id} onClick={() => navigate(`/organisations/${o.id}`)}
                className="p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-pluto-200 hover:bg-pluto-50 transition-all text-left group">
                <div className="w-8 h-8 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold mb-2 group-hover:bg-pluto-200 transition-colors">
                  {o.name.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{o.name}</p>
                <p className="text-xs text-gray-400 truncate">{o.sector}</p>
                {o.outstanding > 0 && (
                  <p className="text-xs text-red-500 font-medium mt-1">{(o.outstanding / 1000).toFixed(0)}K owed</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      {modal === 'org' && <NewOrganisationModal onClose={() => setModal(null)} onCreated={id => { setModal(null); navigate(`/organisations/${id}`) }} />}
      {modal === 'contact' && <NewContactModal onClose={() => setModal(null)} onCreated={id => { setModal(null); navigate(`/contacts/${id}`) }} />}
      {modal === 'deal' && <NewDealModal onClose={() => setModal(null)} onCreated={id => { setModal(null); navigate(`/pipeline/${id}`) }} />}
    </>
  )
}
