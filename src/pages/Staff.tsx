import { useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { staff, leaveRequests, disciplinaryLog } from '../data/mockData'
import { ChevronRight } from 'lucide-react'

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-amber-100 text-amber-700',
  Suspended: 'bg-red-100 text-red-700',
}
const leaveStatusColors: Record<string, string> = {
  Approved: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Rejected: 'bg-red-100 text-red-700',
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Staff() {
  const { t } = useLang()
  const [tab, setTab] = useState<'overview' | 'schedule' | 'leave' | 'disciplinary'>('overview')

  return (
    <>
      <TopBar title={t('staff')} />
      <main className="p-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {(['overview','schedule','leave','disciplinary'] as const).map(k => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${tab===k ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {k === 'leave' ? t('leave & absence') : t(k)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{staff.length} staff members</p>
              <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ Add Staff</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Department</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Start Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              </tr></thead>
              <tbody>{staff.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer group">
                  <td className="px-4 py-3">
                    <Link to={`/staff/${s.id}`} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold">
                        {s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-pluto-700 transition-colors">{s.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.role}</td>
                  <td className="px-4 py-3 text-gray-500">{s.department}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{s.startDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3"><Link to={`/staff/${s.id}`}><ChevronRight size={14} className="text-gray-300 group-hover:text-pluto-500"/></Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {tab === 'schedule' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Week of 7–12 July 2026</h2>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Staff</th>
                {days.map(d => <th key={d} className="text-center px-3 py-3 font-medium text-gray-500">{d}</th>)}
              </tr></thead>
              <tbody>{staff.map(s => (
                <tr key={s.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  {days.map(day => {
                    const onLeave = s.status === 'On Leave' && day !== 'Sat'
                    return (
                      <td key={day} className="text-center px-3 py-3">
                        {day === 'Sat'
                          ? <span className="text-gray-300 text-xs">—</span>
                          : onLeave
                          ? <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-xs rounded">Leave</span>
                          : <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">✓</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {tab === 'leave' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{leaveRequests.length} requests</p>
              <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ New Request</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Staff</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">From</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">To</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Days</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              </tr></thead>
              <tbody>{leaveRequests.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{l.staff}</td>
                  <td className="px-4 py-3 text-gray-500">{l.type}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{l.from}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{l.to}</td>
                  <td className="px-4 py-3 text-gray-500">{l.days}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${leaveStatusColors[l.status]}`}>{l.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {tab === 'disciplinary' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{disciplinaryLog.length} records</p>
              <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ Log Incident</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Staff</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Notes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Outcome</th>
              </tr></thead>
              <tbody>{disciplinaryLog.map(d => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">{d.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{d.staff}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">{d.type}</span></td>
                  <td className="px-4 py-3 text-gray-500">{d.notes}</td>
                  <td className="px-4 py-3 text-gray-500">{d.outcome}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </main>
    </>
  )
}
