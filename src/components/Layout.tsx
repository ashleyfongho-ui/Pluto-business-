import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import HelpPanel from './HelpPanel'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56 pt-14">
        <Outlet />
      </div>
      <HelpPanel />
    </div>
  )
}
