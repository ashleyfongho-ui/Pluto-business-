import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Users, GitBranch, FileText,
  Package, Truck, Megaphone, BarChart3, UserCheck, MessageSquare,
  Settings, Landmark, Zap, MessageCircle, X, ChevronRight,
} from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { usePermissions } from '../context/PermissionsContext'
import { chatChannels, chatMessages, systemUsers } from '../data/mockData'

const navItems = [
  { path: '/', icon: LayoutDashboard, key: 'dashboard', exact: true },
  { path: '/organisations', icon: Building2, key: 'organisations' },
  { path: '/contacts', icon: Users, key: 'contacts' },
  { path: '/pipeline', icon: GitBranch, key: 'pipeline' },
  { path: '/invoices', icon: FileText, key: 'invoices' },
  { path: '/accounting', icon: Landmark, key: 'accounting' },
  { path: '/inventory', icon: Package, key: 'inventory' },
  { path: '/logistics', icon: Truck, key: 'logistics' },
  { path: '/campaigns', icon: Megaphone, key: 'campaigns' },
  { path: '/reports', icon: BarChart3, key: 'reports' },
  { path: '/staff', icon: UserCheck, key: 'staff' },
  { path: '/settings', icon: Settings, key: 'settings' },
]

// ─── Inline Chat Slide-over ────────────────────────────────────────────────
function ChatPanel({ onClose }: { onClose: () => void }) {
  const [activeChannel, setActiveChannel] = useState('ch-general')
  const [message, setMessage] = useState('')
  const messages = chatMessages[activeChannel] || []

  const getUserName = (uid: string) => systemUsers.find(u => u.id === uid)?.name.split(' ')[0] || uid
  const getUserAvatar = (uid: string) => systemUsers.find(u => u.id === uid)?.avatar || '??'

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-pluto-900">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-pluto-300" />
          <span className="text-sm font-semibold text-white">Team Chat</span>
        </div>
        <button onClick={onClose} className="text-pluto-300 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Channels sidebar */}
        <div className="w-24 border-r border-gray-100 bg-gray-50 flex flex-col py-2 gap-0.5">
          {chatChannels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`mx-1 px-2 py-2 rounded-lg text-xs font-medium text-left leading-tight transition-colors ${
                activeChannel === ch.id
                  ? 'bg-pluto-600 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              # {ch.name}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {getUserAvatar(msg.from)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-gray-900">{getUserName(msg.from)}</span>
                    <span className="text-xs text-gray-400">{msg.ts}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && message.trim()) setMessage('') }}
                placeholder="Message…"
                className="flex-1 bg-transparent text-xs text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={() => setMessage('')}
                className="text-pluto-600 hover:text-pluto-800 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { t } = useLang()
  const { isPlutoStaff, currentUser } = usePermissions()
  const [showChat, setShowChat] = useState(false)

  return (
    <>
      <aside className="fixed top-0 left-0 h-full w-56 bg-pluto-900 flex flex-col z-30">

        {/* ── Company Logo Area ─────────────────────────────────── */}
        <div className="px-4 pt-5 pb-4 border-b border-pluto-700/60">
          {/* Logo placeholder */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pluto-400 to-pluto-600 flex items-center justify-center shadow-lg shrink-0">
              <span className="text-white font-black text-sm tracking-tight">PC</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight">PreCure</p>
              <p className="text-pluto-300 text-xs leading-tight">Health Innovations</p>
            </div>
          </div>
          {/* Change logo link */}
          <button className="text-pluto-400 text-xs hover:text-pluto-200 transition-colors flex items-center gap-1 pl-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
            Change company logo
          </button>
        </div>

        {/* ── Navigation ───────────────────────────────────────── */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, key, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-pluto-600 text-white shadow-sm'
                    : 'text-pluto-200 hover:bg-pluto-800 hover:text-white'
                }`
              }
            >
              <Icon size={15} />
              {t(key)}
            </NavLink>
          ))}
        </nav>

        {/* ── Pluto Admin link — staff only ───────────────────── */}
        {isPlutoStaff && (
          <div className="px-2 pb-2">
            <Link
              to="/pluto-admin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors border border-red-900/30"
            >
              <Zap size={13} /> Pluto Admin
            </Link>
          </div>
        )}

        {/* ── Chat icon ────────────────────────────────────────── */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setShowChat(s => !s)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              showChat
                ? 'bg-pluto-600 text-white'
                : 'text-pluto-200 hover:bg-pluto-800 hover:text-white'
            }`}
          >
            <MessageCircle size={15} />
            {t('chat')}
            <span className="ml-auto w-4 h-4 bg-pluto-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>
        </div>

        {/* ── User footer ──────────────────────────────────────── */}
        <div className="px-4 py-3 border-t border-pluto-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-pluto-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{currentUser.avatar}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{currentUser.name}</p>
              <p className="text-pluto-300 text-xs truncate">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Chat slide-over ──────────────────────────────────────── */}
      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}
    </>
  )
}
