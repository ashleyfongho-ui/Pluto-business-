import { useState } from 'react'
import {
  Building2, Users, Shield, Settings, Eye, EyeOff, Play, Pause,
  Plus, ChevronRight, ToggleLeft, ToggleRight, Globe, Zap, Lock,
  AlertTriangle, CheckCircle, Clock, TrendingUp, X, LogIn
} from 'lucide-react'
import { usePermissions, allUsers, roleConfig, UserRole, SystemUser } from '../context/PermissionsContext'
import { businessTypeConfig, BusinessType } from '../context/AppContext'

// ─── Mock tenant data ──────────────────────────────────────────────────────────
const tenants = [
  {
    id: 't1', name: 'PreCure / Pluto Business (Demo)', country: 'CM',
    businessType: 'pharma' as BusinessType,
    plan: 'Pro', status: 'active',
    users: 6, createdAt: '2024-01-15',
    modules: { inventory: true, logistics: true, accounting: true, campaigns: true, payroll: true },
    lastLogin: '10 min ago', mrr: 85000,
  },
  {
    id: 't2', name: 'Marché Mokolo Distributors', country: 'CM',
    businessType: 'produce' as BusinessType,
    plan: 'Starter', status: 'active',
    users: 3, createdAt: '2025-03-01',
    modules: { inventory: true, logistics: true, accounting: false, campaigns: false, payroll: false },
    lastLogin: '2h ago', mrr: 25000,
  },
  {
    id: 't3', name: 'Abuja Travel & Tours', country: 'NG',
    businessType: 'services' as BusinessType,
    plan: 'Growth', status: 'active',
    users: 8, createdAt: '2025-06-01',
    modules: { inventory: false, logistics: true, accounting: true, campaigns: true, payroll: true },
    lastLogin: 'Yesterday', mrr: 55000,
  },
  {
    id: 't4', name: 'CleanCity Waste Mgmt', country: 'GH',
    businessType: 'manufacturing' as BusinessType,
    plan: 'Pro', status: 'suspended',
    users: 4, createdAt: '2025-01-10',
    modules: { inventory: true, logistics: true, accounting: true, campaigns: false, payroll: true },
    lastLogin: '3 days ago', mrr: 0,
  },
  {
    id: 't5', name: 'BuildRight Construction', country: 'CM',
    businessType: 'manufacturing' as BusinessType,
    plan: 'Starter', status: 'trial',
    users: 2, createdAt: '2026-07-01',
    modules: { inventory: true, logistics: false, accounting: false, campaigns: false, payroll: false },
    lastLogin: '1h ago', mrr: 0,
  },
]

const planColors: Record<string, string> = {
  Starter: 'bg-gray-100 text-gray-600',
  Growth: 'bg-blue-100 text-blue-700',
  Pro: 'bg-pluto-100 text-pluto-700',
}
const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  trial: 'bg-amber-100 text-amber-700',
}

type AdminTab = 'tenants' | 'users' | 'permissions' | 'impersonate' | 'metrics'

export default function PlutoAdmin() {
  const { currentUser, can, isPlutoStaff, setCurrentUser } = usePermissions()
  const [tab, setTab] = useState<AdminTab>('tenants')
  const [selectedTenant, setSelectedTenant] = useState<typeof tenants[0] | null>(null)
  const [showNewTenant, setShowNewTenant] = useState(false)
  const [impersonateTarget, setImpersonateTarget] = useState<typeof tenants[0] | null>(null)
  const [userToEdit, setUserToEdit] = useState<SystemUser | null>(null)

  // Access gate — only Pluto staff
  if (!isPlutoStaff) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm text-center">
          <Lock size={36} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-500 text-sm mb-4">The Pluto Admin panel is only accessible to Pluto staff.</p>
          <p className="text-xs text-gray-400">Currently logged in as: <strong>{currentUser.name}</strong> ({currentUser.role})</p>
          <button onClick={() => setCurrentUser(allUsers.find(u => u.role === 'pluto_admin')!)}
            className="mt-4 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">
            Switch to Pluto Admin
          </button>
        </div>
      </div>
    )
  }

  const totalMRR = tenants.filter(t => t.status === 'active').reduce((s, t) => s + t.mrr, 0)
  const activeTenants = tenants.filter(t => t.status === 'active').length

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Pluto Admin Header */}
      <header className="bg-black border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pluto-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-sm">PLUTO ADMIN</span>
            <span className="ml-2 px-1.5 py-0.5 bg-red-900 text-red-300 rounded text-xs font-semibold">INTERNAL ONLY</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">Logged in as: <span className="text-white font-medium">{currentUser.name}</span></span>
          <button onClick={() => window.history.back()}
            className="px-3 py-1.5 border border-gray-700 text-gray-400 rounded-lg text-xs hover:border-gray-500 hover:text-gray-200">
            ← Back to CRM
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-52 bg-gray-900 min-h-screen p-4 border-r border-gray-800">
          {([
            ['tenants', Building2, 'Tenants'],
            ['users', Users, 'Users & Roles'],
            ['permissions', Shield, 'Permissions'],
            ['impersonate', Eye, 'Impersonate'],
            ['metrics', TrendingUp, 'Metrics'],
          ] as [AdminTab, typeof Building2, string][]).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all text-left ${
                tab === key ? 'bg-pluto-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}>
              <Icon size={14} />
              {label}
            </button>
          ))}

          <div className="mt-auto pt-4 border-t border-gray-800 mt-8">
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 font-semibold mb-1">MRR</p>
              <p className="text-lg font-bold text-white">{(totalMRR/1000).toFixed(0)}K CFA</p>
              <p className="text-xs text-gray-500">{activeTenants} active tenants</p>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">

          {/* TENANTS */}
          {tab === 'tenants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-white text-xl font-bold">Tenants</h1>
                  <p className="text-gray-400 text-sm mt-0.5">{tenants.length} businesses on Pluto</p>
                </div>
                <button onClick={() => setShowNewTenant(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-pluto-600 text-white rounded-xl text-sm font-medium hover:bg-pluto-700">
                  <Plus size={14} /> Add Tenant
                </button>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Tenants', value: tenants.length, icon: Building2, color: 'text-white' },
                  { label: 'Active', value: activeTenants, icon: CheckCircle, color: 'text-green-400' },
                  { label: 'Trial', value: tenants.filter(t => t.status === 'trial').length, icon: Clock, color: 'text-amber-400' },
                  { label: 'Suspended', value: tenants.filter(t => t.status === 'suspended').length, icon: AlertTriangle, color: 'text-red-400' },
                ].map(m => (
                  <div key={m.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <p className="text-gray-500 text-xs mb-1">{m.label}</p>
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Tenant table */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Business</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Plan</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Users</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">MRR</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Last Active</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map(t => {
                      const btCfg = businessTypeConfig[t.businessType]
                      return (
                        <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
                          onClick={() => setSelectedTenant(t)}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                                {t.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-white">{t.name}</p>
                                <p className="text-xs text-gray-500">{t.country} · Since {t.createdAt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-300">{btCfg.emoji} {btCfg.label}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[t.plan]}`}>{t.plan}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-300">{t.users}</td>
                          <td className="px-4 py-3 text-gray-300">{t.mrr > 0 ? `${(t.mrr/1000).toFixed(0)}K CFA` : '—'}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{t.lastLogin}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={e => { e.stopPropagation(); setImpersonateTarget(t) }}
                                className="px-2 py-1 bg-pluto-900 text-pluto-400 rounded text-xs hover:bg-pluto-800 flex items-center gap-0.5">
                                <LogIn size={10} /> Login As
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS & ROLES */}
          {tab === 'users' && (
            <div className="space-y-4">
              <h1 className="text-white text-xl font-bold">Users & Roles</h1>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Department</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(u => (
                      <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-pluto-700 flex items-center justify-center text-xs font-bold text-white">
                              {u.avatar}
                            </div>
                            <span className="font-medium text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleConfig[u.role].color}`}>
                            {roleConfig[u.role].label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{u.department}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 text-xs font-medium w-fit ${u.active ? 'text-green-400' : 'text-gray-600'}`}>
                            {u.active ? <CheckCircle size={11} /> : <Pause size={11} />}
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setUserToEdit(u)}
                            className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-2 py-1 rounded">
                            Edit Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PERMISSIONS */}
          {tab === 'permissions' && (
            <div className="space-y-4">
              <h1 className="text-white text-xl font-bold">Permission Matrix</h1>
              <p className="text-gray-400 text-sm">What each role can and cannot do across Pluto.</p>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Permission</th>
                      {(Object.keys(roleConfig) as UserRole[]).map(role => (
                        <th key={role} className="text-center px-3 py-3 font-medium text-gray-500">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${roleConfig[role].color}`}>{roleConfig[role].label}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      ['canEdit', 'Edit records'],
                      ['canDelete', 'Delete records'],
                      ['canViewAll', 'View all (not just own)'],
                      ['canManageStaff', 'Manage staff & payroll'],
                      ['canViewFinancials', 'View financials'],
                      ['canManageBilling', 'Manage billing'],
                      ['canImpersonate', 'Impersonate clients'],
                      ['canManageTenants', 'Manage tenants'],
                    ] as [keyof typeof roleConfig[UserRole], string][]).map(([key, label]) => (
                      <tr key={key} className="border-b border-gray-800">
                        <td className="px-4 py-3 text-gray-300">{label}</td>
                        {(Object.keys(roleConfig) as UserRole[]).map(role => (
                          <td key={role} className="text-center px-3 py-3">
                            {roleConfig[role][key]
                              ? <span className="text-green-400 text-lg">✓</span>
                              : <span className="text-gray-700 text-lg">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* IMPERSONATE */}
          {tab === 'impersonate' && (
            <div className="space-y-4">
              <h1 className="text-white text-xl font-bold">Client Impersonation</h1>
              <div className="bg-amber-900/30 border border-amber-700 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-amber-200 text-sm font-semibold">Impersonation Protocol</p>
                    <p className="text-amber-400 text-xs mt-1">All impersonation sessions are logged with timestamp, Pluto staff ID, and reason. Clients can view their access log in Settings. Default is read-only — write access requires explicit override.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {tenants.filter(t => t.status !== 'suspended').map(t => (
                  <div key={t.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.plan} · {t.users} users · {t.lastLogin}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span>
                    </div>
                    <div className="flex gap-2">
                      <select className="flex-1 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
                        <option>Support request</option>
                        <option>Technical issue</option>
                        <option>Data audit</option>
                        <option>Onboarding help</option>
                      </select>
                      <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700 flex items-center gap-1">
                        <LogIn size={11} /> Login As
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 text-center">Session limit: 2 hours. Auto-logged out. Client receives email notification.</p>
            </div>
          )}

          {/* METRICS */}
          {tab === 'metrics' && (
            <div className="space-y-4">
              <h1 className="text-white text-xl font-bold">Platform Metrics</h1>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total MRR', value: `${(totalMRR/1000).toFixed(0)}K CFA`, sub: 'monthly recurring', color: 'text-green-400' },
                  { label: 'Active Tenants', value: activeTenants, sub: `of ${tenants.length} total`, color: 'text-white' },
                  { label: 'Total Users', value: tenants.reduce((s,t)=>s+t.users,0), sub: 'across all tenants', color: 'text-white' },
                  { label: 'Avg MRR / Tenant', value: `${(totalMRR/Math.max(activeTenants,1)/1000).toFixed(0)}K CFA`, sub: 'per active tenant', color: 'text-pluto-400' },
                ].map(m => (
                  <div key={m.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                    <p className="text-gray-500 text-xs mb-1">{m.label}</p>
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-gray-600 mt-1">{m.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Revenue by plan */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                  <h3 className="text-white font-semibold mb-4">Tenants by Plan</h3>
                  {['Pro', 'Growth', 'Starter'].map(plan => {
                    const count = tenants.filter(t => t.plan === plan).length
                    const revenue = tenants.filter(t => t.plan === plan && t.status === 'active').reduce((s,t)=>s+t.mrr,0)
                    return (
                      <div key={plan} className="flex items-center gap-3 mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-16 text-center ${planColors[plan]}`}>{plan}</span>
                        <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-pluto-600" style={{ width: `${(count/tenants.length)*100}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs w-20 text-right">{count} · {revenue > 0 ? `${(revenue/1000).toFixed(0)}K` : '—'}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Business types */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                  <h3 className="text-white font-semibold mb-4">Tenants by Business Type</h3>
                  {(Object.keys(businessTypeConfig) as BusinessType[]).map(bt => {
                    const count = tenants.filter(t => t.businessType === bt).length
                    if (!count) return null
                    return (
                      <div key={bt} className="flex items-center gap-3 mb-3">
                        <span className="text-sm w-6">{businessTypeConfig[bt].emoji}</span>
                        <span className="text-gray-300 text-sm flex-1">{businessTypeConfig[bt].label}</span>
                        <span className="text-gray-500 text-xs">{count} tenant{count>1?'s':''}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Tenant detail slide-over */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={() => setSelectedTenant(null)} />
          <div className="w-96 bg-gray-900 h-full overflow-y-auto border-l border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="font-semibold text-white">{selectedTenant.name}</h2>
              <button onClick={() => setSelectedTenant(null)} className="text-gray-500 hover:text-gray-300"><X size={18}/></button>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedTenant.status]}`}>{selectedTenant.status}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[selectedTenant.plan]}`}>{selectedTenant.plan}</span>
                <span className="text-gray-500 text-xs">{selectedTenant.users} users</span>
              </div>

              {/* Module toggles */}
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Module Access</p>
                <div className="space-y-2">
                  {Object.entries(selectedTenant.modules).map(([mod, enabled]) => (
                    <div key={mod} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 capitalize">{mod}</span>
                      <button className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-pluto-600' : 'bg-gray-700'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan selector */}
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Plan</p>
                <select className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option>Starter</option>
                  <option selected={selectedTenant.plan === 'Growth'}>Growth</option>
                  <option selected={selectedTenant.plan === 'Pro'}>Pro</option>
                </select>
              </div>

              {/* Account actions */}
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Actions</p>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-colors">
                    <LogIn size={14} /> Login as this client
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-colors">
                    <Settings size={14} /> Edit configuration
                  </button>
                  {selectedTenant.status === 'active' ? (
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 bg-red-900/50 hover:bg-red-900 text-red-400 rounded-xl text-sm transition-colors">
                      <Pause size={14} /> Suspend account
                    </button>
                  ) : (
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 bg-green-900/50 hover:bg-green-900 text-green-400 rounded-xl text-sm transition-colors">
                      <Play size={14} /> Reactivate account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showNewTenant && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">Add New Tenant</h3>
              <button onClick={() => setShowNewTenant(false)} className="text-gray-500 hover:text-gray-300"><X size={18}/></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Business Name</label>
                <input placeholder="e.g. Pharma Plus SARL" className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Country</label>
                  <select className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option>Cameroon</option><option>Nigeria</option><option>Ghana</option><option>Senegal</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Business Type</label>
                  <select className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    {(Object.keys(businessTypeConfig) as BusinessType[]).map(bt => (
                      <option key={bt} value={bt}>{businessTypeConfig[bt].emoji} {businessTypeConfig[bt].label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Plan</label>
                  <select className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option>Starter</option><option>Growth</option><option>Pro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Admin Email</label>
                  <input type="email" placeholder="admin@business.com" className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Modules to Enable</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Inventory', 'Logistics', 'Accounting', 'Campaigns', 'Payroll', 'Reports'].map(mod => (
                    <label key={mod} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-pluto-600" />
                      <span className="text-xs text-gray-300">{mod}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowNewTenant(false)} className="flex-1 py-2 border border-gray-700 text-gray-400 rounded-lg text-sm hover:border-gray-600">Cancel</button>
              <button onClick={() => setShowNewTenant(false)} className="flex-1 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Create Tenant & Send Invite</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Role Modal */}
      {userToEdit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Edit Role — {userToEdit.name}</h3>
              <button onClick={() => setUserToEdit(null)} className="text-gray-500 hover:text-gray-300"><X size={18}/></button>
            </div>
            <div className="space-y-2 mb-4">
              {(Object.keys(roleConfig) as UserRole[]).map(role => (
                <label key={role} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                  userToEdit.role === role ? 'border-pluto-500 bg-pluto-900/20' : 'border-gray-800 hover:border-gray-700'
                }`}>
                  <input type="radio" name="role" value={role} defaultChecked={userToEdit.role === role} className="accent-pluto-600 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleConfig[role].color}`}>{roleConfig[role].label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{roleConfig[role].description}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setUserToEdit(null)} className="flex-1 py-2 border border-gray-700 text-gray-400 rounded-lg text-sm">Cancel</button>
              <button onClick={() => setUserToEdit(null)} className="flex-1 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Save Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
