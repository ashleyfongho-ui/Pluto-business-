import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Users, GitBranch, FileText,
  Package, Truck, Megaphone, BarChart3, UserCheck, MessageSquare, Settings, Landmark
} from 'lucide-react'
import { useLang } from '../context/LanguageContext'

const navItems = [
  { path: '/', icon: LayoutDashboard, key: 'dashboard', exact: true },
  { path: '/organisations', icon: Building2, key: 'organisations' },
  { path: '/contacts', icon: Users, key: 'contacts' },
  { path: '/pipeline', icon: GitBranch, key: 'pipeline' },
  { path: '/accounting', icon: Landmark, key: 'accounting' },
  { path: '/inventory', icon: Package, key: 'inventory' },
  { path: '/logistics', icon: Truck, key: 'logistics' },
  { path: '/campaigns', icon: Megaphone, key: 'campaigns' },
  { path: '/reports', icon: BarChart3, key: 'reports' },
  { path: '/staff', icon: UserCheck, key: 'staff' },
  { path: '/chat', icon: MessageSquare, key: 'chat' },
  { path: '/settings', icon: Settings, key: 'settings' },
]

export default function Sidebar() {
  const { t } = useLang()

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-pluto-900 flex flex-col z-30">
      {/* Brand header */}
      <div className="px-4 pt-6 pb-4 border-b border-pluto-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-pluto-400 flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="text-white font-black text-base tracking-wide">PLUTO BUSINESS</span>
        </div>
        <p className="text-pluto-300 text-xs pl-9">Cameroon CRM</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, key, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-pluto-600 text-white shadow-sm'
                  : 'text-pluto-200 hover:bg-pluto-800 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {t(key)}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-3 border-t border-pluto-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-pluto-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">FM</span>
          </div>
          <div>
            <p className="text-white text-xs font-medium">Fabrice Mvondo</p>
            <p className="text-pluto-300 text-xs">Pro Plan · Owner</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
