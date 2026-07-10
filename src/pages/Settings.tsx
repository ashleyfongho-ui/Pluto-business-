import { useState } from 'react'
import {
  Building2, Users, Plug, CreditCard, Bell, Shield,
  Check, ChevronRight, Globe, Clock, DollarSign, Mail,
  Phone, Smartphone, Eye, EyeOff, Plus, Trash2
} from 'lucide-react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { systemUsers, staff } from '../data/mockData'

type Tab = 'company' | 'users' | 'integrations' | 'notifications' | 'security' | 'billing'

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'company', label: 'Company', icon: Building2 },
  { key: 'users', label: 'Users & Roles', icon: Users },
  { key: 'integrations', label: 'Integrations', icon: Plug },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'billing', label: 'Plan & Billing', icon: CreditCard },
]

const integrations = [
  {
    id: 'momo',
    name: 'MTN Mobile Money',
    description: 'Auto-reconcile MoMo payments against invoices',
    status: 'connected',
    logo: '📱',
    phase: 'live',
  },
  {
    id: 'orange',
    name: 'Orange Money',
    description: 'Receive Orange Money payments and track in real time',
    status: 'pending',
    logo: '🟠',
    phase: 'live',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    description: 'Send invoices, reminders, and campaign messages via WhatsApp',
    status: 'not_connected',
    logo: '💬',
    phase: 'phase2',
  },
  {
    id: 'smtp',
    name: 'Email (SMTP)',
    description: 'Send invoices and reminders via your own email server',
    status: 'connected',
    logo: '📧',
    phase: 'live',
  },
  {
    id: 'supabase',
    name: 'Supabase (Database)',
    description: 'Real-time backend — replace mock data with live database',
    status: 'not_connected',
    logo: '🗄️',
    phase: 'phase2',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Sync invoices and payments with QuickBooks accounting',
    status: 'not_connected',
    logo: '📊',
    phase: 'phase2',
  },
]

const roleColors: Record<string, string> = {
  Owner: 'bg-pluto-100 text-pluto-700',
  Admin: 'bg-blue-100 text-blue-700',
  Sales: 'bg-green-100 text-green-700',
  Operations: 'bg-amber-100 text-amber-700',
}

export default function Settings() {
  const { t } = useLang()
  const [tab, setTab] = useState<Tab>('company')
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [notifications, setNotifications] = useState({
    newDeal: true,
    invoicePaid: true,
    invoiceOverdue: true,
    lowStock: true,
    staffLeave: false,
    weeklyReport: true,
    channels: { email: true, whatsapp: false, inApp: true },
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleNotif = (key: keyof typeof notifications) => {
    if (typeof notifications[key] === 'boolean') {
      setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    }
  }

  return (
    <>
      <TopBar title={t('settings')} />
      <main className="p-6">
        <div className="flex gap-6">
          {/* Left nav */}
          <div className="w-52 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-b border-gray-50 last:border-0 ${
                    tab === key
                      ? 'bg-pluto-50 text-pluto-700 border-l-2 border-l-pluto-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  {tab === key && <ChevronRight size={13} className="ml-auto text-pluto-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* COMPANY */}
            {tab === 'company' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-5">Company Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Company Name', value: 'PreCure CRM', icon: Building2 },
                      { label: 'Industry', value: 'Health & Preventative Care', icon: Globe },
                      { label: 'Country', value: 'Cameroon', icon: Globe },
                      { label: 'City', value: 'Yaoundé', icon: Globe },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                        <input
                          defaultValue={f.value}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                        <option>CFA Franc (XAF)</option>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>GHS (Ghana Cedi)</option>
                        <option>NGN (Naira)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Timezone</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                        <option>Africa/Douala (WAT +01:00)</option>
                        <option>Africa/Lagos (WAT +01:00)</option>
                        <option>Africa/Accra (GMT)</option>
                        <option>Africa/Johannesburg (SAST +02:00)</option>
                        <option>Europe/London (GMT/BST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                        <option>English</option>
                        <option>Français</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Fiscal Year Start</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                        <option>January</option>
                        <option>April</option>
                        <option>July</option>
                        <option>October</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Company Address</label>
                    <textarea
                      rows={2}
                      defaultValue="Avenue Kennedy, Yaoundé, Centre Region, Cameroon"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Contact Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Phone', value: '+237 6 55 12 34 56', icon: Phone },
                      { label: 'Email', value: 'contact@precure.cm', icon: Mail },
                      { label: 'WhatsApp', value: '+237 6 55 12 34 56', icon: Smartphone },
                      { label: 'Website', value: 'www.precure.cm', icon: Globe },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                        <input
                          defaultValue={f.value}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Module Access</h2>
                  <div className="space-y-1">
                    {[
                      { label: 'Logistics Module', desc: 'Track deliveries and driver routes', enabled: true },
                      { label: 'HR / Staff Module', desc: 'Manage staff, schedules, and leave', enabled: true },
                      { label: 'Bank Reconciliation', desc: 'Match bank transactions to invoices', enabled: true },
                      { label: 'Campaigns', desc: 'WhatsApp and email marketing campaigns', enabled: true },
                      { label: 'Reports & Analytics', desc: 'Sales, inventory, and pipeline reports', enabled: true },
                      { label: 'Internal Chat', desc: 'Team messaging and channels', enabled: true },
                    ].map(m => (
                      <div key={m.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.label}</p>
                          <p className="text-xs text-gray-400">{m.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={m.enabled} className="sr-only peer" />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pluto-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      saved ? 'bg-green-500 text-white' : 'bg-pluto-600 text-white hover:bg-pluto-700'
                    }`}>
                    {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Team Members</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                      <Plus size={13} /> Invite User
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Access</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {systemUsers.map(u => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-pluto-500 flex items-center justify-center text-white text-xs font-bold">
                                {u.avatar}
                              </div>
                              <span className="font-medium text-gray-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{staff.find(s => s.name === u.name)?.email || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || 'bg-gray-100 text-gray-600'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-pluto-300">
                              <option>Full Access</option>
                              <option>Sales Only</option>
                              <option>View Only</option>
                              <option>Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-xs text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Role Permissions</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 text-gray-500 font-medium">Module</th>
                          {['Owner', 'Admin', 'Sales', 'Operations'].map(r => (
                            <th key={r} className="text-center py-2 px-3 text-gray-500 font-medium">{r}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {['Organisations', 'Contacts', 'Pipeline', 'Invoices', 'Accounting', 'Inventory', 'Logistics', 'Staff', 'Reports', 'Settings'].map(mod => (
                          <tr key={mod} className="border-b border-gray-50">
                            <td className="py-2 text-gray-700 font-medium">{mod}</td>
                            {['Owner', 'Admin', 'Sales', 'Operations'].map(role => {
                              const allowed = role === 'Owner' ||
                                (role === 'Admin' && mod !== 'Settings') ||
                                (role === 'Sales' && ['Organisations', 'Contacts', 'Pipeline', 'Invoices'].includes(mod)) ||
                                (role === 'Operations' && ['Inventory', 'Logistics', 'Reports'].includes(mod))
                              return (
                                <td key={role} className="py-2 px-3 text-center">
                                  {allowed
                                    ? <Check size={13} className="mx-auto text-green-500" />
                                    : <span className="text-gray-200">—</span>}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* INTEGRATIONS */}
            {tab === 'integrations' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {integrations.map(intg => (
                    <div key={intg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">
                            {intg.logo}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 text-sm">{intg.name}</p>
                              {intg.phase === 'phase2' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">Phase 2</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{intg.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            intg.status === 'connected' ? 'bg-green-100 text-green-700' :
                            intg.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {intg.status === 'connected' ? '● Connected' :
                             intg.status === 'pending' ? '◌ Pending' : '○ Not connected'}
                          </span>
                          <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            intg.status === 'connected'
                              ? 'border border-red-200 text-red-500 hover:bg-red-50'
                              : intg.phase === 'phase2'
                              ? 'border border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-pluto-600 text-white hover:bg-pluto-700'
                          }`}>
                            {intg.status === 'connected' ? 'Disconnect' : intg.phase === 'phase2' ? 'Coming Soon' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center">Phase 2 integrations will be available after backend deployment.</p>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {tab === 'notifications' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-5">Notification Events</h2>
                  <div className="space-y-1">
                    {[
                      { key: 'newDeal', label: 'New deal added to pipeline', desc: 'Notify when a deal is created or assigned' },
                      { key: 'invoicePaid', label: 'Invoice paid', desc: 'Notify when a payment is confirmed' },
                      { key: 'invoiceOverdue', label: 'Invoice overdue', desc: 'Alert when invoice passes due date unpaid' },
                      { key: 'lowStock', label: 'Low stock alert', desc: 'Notify when inventory falls below threshold' },
                      { key: 'staffLeave', label: 'Staff leave requests', desc: 'Notify on new leave or absence requests' },
                      { key: 'weeklyReport', label: 'Weekly summary report', desc: 'Auto-send every Monday morning' },
                    ].map(n => (
                      <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{n.label}</p>
                          <p className="text-xs text-gray-400">{n.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[n.key as keyof typeof notifications] as boolean}
                            onChange={() => toggleNotif(n.key as keyof typeof notifications)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pluto-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Delivery Channels</h2>
                  <div className="space-y-3">
                    {[
                      { key: 'email', label: 'Email', desc: 'contact@precure.cm', icon: Mail },
                      { key: 'whatsapp', label: 'WhatsApp', desc: '+237 6 55 12 34 56 (Phase 2)', icon: Smartphone },
                      { key: 'inApp', label: 'In-app', desc: 'Notifications inside Pluto Business', icon: Bell },
                    ].map(ch => (
                      <div key={ch.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-3">
                          <ch.icon size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{ch.label}</p>
                            <p className="text-xs text-gray-400">{ch.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.channels[ch.key as keyof typeof notifications.channels]}
                            onChange={() => setNotifications(prev => ({
                              ...prev,
                              channels: { ...prev.channels, [ch.key]: !prev.channels[ch.key as keyof typeof notifications.channels] }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pluto-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      saved ? 'bg-green-500 text-white' : 'bg-pluto-600 text-white hover:bg-pluto-700'
                    }`}>
                    {saved ? <><Check size={14} /> Saved</> : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {tab === 'security' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-5">Password</h2>
                  <div className="space-y-3 max-w-md">
                    {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                      <div key={label}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-9 focus:outline-none focus:ring-2 focus:ring-pluto-300"
                          />
                          <button onClick={() => setShowPassword(s => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-semibold text-gray-900">Two-Factor Authentication</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Adds an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(s => !s)} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pluto-600"></div>
                    </label>
                  </div>
                  {twoFA && (
                    <div className="bg-pluto-50 rounded-lg p-4 border border-pluto-100">
                      <p className="text-sm text-pluto-700 font-medium mb-2">2FA via Authenticator App</p>
                      <p className="text-xs text-pluto-600">Scan the QR code in Google Authenticator or Authy. Setup will complete on next login.</p>
                      <div className="mt-3 w-24 h-24 bg-pluto-200 rounded-lg flex items-center justify-center text-xs text-pluto-500">QR Code</div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Active Sessions</h2>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome on macOS', location: 'Yaoundé, Cameroon', time: 'Now', current: true },
                      { device: 'Safari on iPhone', location: 'Douala, Cameroon', time: '2 hours ago', current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Shield size={16} className={session.current ? 'text-green-500' : 'text-gray-400'} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{session.device}</p>
                            <p className="text-xs text-gray-400">{session.location} · {session.time}</p>
                          </div>
                          {session.current && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current</span>}
                        </div>
                        {!session.current && (
                          <button className="text-xs text-red-500 hover:text-red-700 font-medium">Sign out</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BILLING */}
            {tab === 'billing' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-pluto-700 to-pluto-900 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-pluto-200 text-xs font-medium uppercase tracking-wider mb-1">Current Plan</p>
                      <h2 className="text-2xl font-bold">Pro Plan</h2>
                      <p className="text-pluto-200 text-sm mt-1">Billed monthly · Renews 9 Aug 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">49,000</p>
                      <p className="text-pluto-200 text-sm">CFA / month</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-pluto-200">
                    <span className="flex items-center gap-1"><Check size={13} /> Unlimited contacts</span>
                    <span className="flex items-center gap-1"><Check size={13} /> All modules</span>
                    <span className="flex items-center gap-1"><Check size={13} /> 3 users</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Starter', price: '19,000', users: '1 user', features: 'CRM + Pipeline + Invoices' },
                    { name: 'Pro', price: '49,000', users: '3 users', features: 'All modules + Logistics + HR', current: true },
                    { name: 'Business', price: '99,000', users: 'Unlimited', features: 'White-label + API + Priority support' },
                  ].map(plan => (
                    <div key={plan.name} className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all ${
                      plan.current ? 'border-pluto-400' : 'border-gray-100 hover:border-pluto-200'
                    }`}>
                      {plan.current && (
                        <span className="text-xs bg-pluto-100 text-pluto-700 px-2 py-0.5 rounded-full font-medium">Current</span>
                      )}
                      <h3 className="font-semibold text-gray-900 mt-2">{plan.name}</h3>
                      <p className="text-xl font-bold text-gray-900 mt-1">{plan.price} <span className="text-xs font-normal text-gray-400">CFA/mo</span></p>
                      <p className="text-xs text-gray-500 mt-1">{plan.users}</p>
                      <p className="text-xs text-gray-400 mt-2">{plan.features}</p>
                      {!plan.current && (
                        <button className="mt-3 w-full px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700 transition-colors">
                          Upgrade
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Billing History</h2>
                    <button className="text-xs text-pluto-600 hover:underline font-medium">Download all</button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { date: '9 Jul 2026', amount: '49,000 CFA', status: 'Paid', ref: 'INV-B-006' },
                      { date: '9 Jun 2026', amount: '49,000 CFA', status: 'Paid', ref: 'INV-B-005' },
                      { date: '9 May 2026', amount: '49,000 CFA', status: 'Paid', ref: 'INV-B-004' },
                    ].map(b => (
                      <div key={b.ref} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">{b.date}</span>
                          <span className="font-mono text-xs text-gray-400">{b.ref}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">{b.amount}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{b.status}</span>
                          <button className="text-xs text-pluto-600 hover:underline">PDF</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50">
                    <CreditCard size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">MTN MoMo Business</p>
                      <p className="text-xs text-gray-400">+237 6 55 00 00 00 · Auto-pay enabled</p>
                    </div>
                    <button className="ml-auto text-xs text-pluto-600 hover:underline font-medium">Change</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </>
  )
}
