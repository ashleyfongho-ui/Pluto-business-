import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Phone, Mail, MapPin, Target, Heart, StickyNote, Plus, Check, Clock } from 'lucide-react'
import TopBar from '../components/TopBar'
import { staff } from '../data/mockData'

const promiseStatusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Fulfilled: 'bg-green-100 text-green-700',
  Active: 'bg-blue-100 text-blue-700',
}

export default function StaffDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const member = staff.find(s => s.id === Number(id))
  const [tab, setTab] = useState<'profile' | 'promises' | 'benefits' | 'notes'>('profile')

  if (!member) return (
    <><TopBar title="Staff member not found" /><main className="p-6"><p className="text-gray-400">Not found.</p></main></>
  )

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'promises', label: `Promises (${member.promises.length})` },
    { key: 'benefits', label: 'Benefits' },
    { key: 'notes', label: 'Notes' },
  ] as const

  return (
    <>
      <TopBar title={member.name} />
      <main className="p-6 max-w-4xl">
        <button onClick={() => navigate('/staff')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
          <ArrowLeft size={14} /> Back to Staff
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-2xl font-bold">
              {member.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{member.name}</h1>
              <p className="text-gray-500">{member.role} · {member.department}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  member.status === 'Active' ? 'bg-green-100 text-green-700' :
                  member.status === 'On Leave' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>{member.status}</span>
                <span className="text-xs text-gray-400">Started {member.startDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${tab===t.key ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Full Name', value: member.name },
                  { label: 'Role', value: member.role },
                  { label: 'Department', value: member.department },
                  { label: 'Start Date', value: member.startDate },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                    <input defaultValue={f.value} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Phone size={14} className="text-pluto-600"/>Contact Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <Phone size={13} className="text-gray-400"/><span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <Mail size={13} className="text-gray-400"/><span className="text-xs">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <MapPin size={13} className="text-gray-400"/><span className="text-xs">{member.address}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Target size={14} className="text-pluto-600"/>Promotion Target</h3>
                <textarea defaultValue={member.promotionTarget} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none" />
              </div>
            </div>
            <div className="col-span-2">
              <button className="px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">Save Changes</button>
            </div>
          </div>
        )}

        {tab === 'promises' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Commitments made to {member.name.split(' ')[0]}. Keep these — they matter for retention.</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                <Plus size={13} /> Add Promise
              </button>
            </div>
            {member.promises.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <p className="text-gray-400 text-sm">No promises logged yet.</p>
              </div>
            ) : (
              member.promises.map(p => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    p.status === 'Fulfilled' ? 'bg-green-100' : p.status === 'Active' ? 'bg-blue-100' : 'bg-amber-100'
                  }`}>
                    {p.status === 'Fulfilled' ? <Check size={14} className="text-green-600"/> : <Clock size={14} className={p.status === 'Active' ? 'text-blue-600' : 'text-amber-600'}/>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{p.promise}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Promised on {p.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${promiseStatusColors[p.status]}`}>{p.status}</span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'benefits' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Heart size={15} className="text-red-500"/>Staff Benefits</h3>
              <div className="space-y-4">
                {/* Health scan */}
                <div className={`p-4 rounded-xl border-2 ${member.benefits.healthScan ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🩺</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">PreCure Health Scan</p>
                        <p className="text-xs text-gray-500">Annual full-body health assessment via PreCure platform</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={member.benefits.healthScan} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-pluto-600 rounded-full peer transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
                    </label>
                  </div>
                  {member.benefits.healthScan && member.benefits.healthScanDate && (
                    <p className="text-xs text-green-700 font-medium">✓ Last scan: {member.benefits.healthScanDate}</p>
                  )}
                  {!member.benefits.healthScan && (
                    <p className="text-xs text-gray-400">Not yet enrolled. Toggle to enable access.</p>
                  )}
                </div>

                {/* Placeholder for more benefits */}
                {[
                  { icon: '🏥', label: 'Private Medical Insurance', desc: 'Company-contributed health cover' },
                  { icon: '🚗', label: 'Company Vehicle', desc: 'Vehicle or transport allowance' },
                  { icon: '📚', label: 'Training Budget', desc: 'Annual professional development allowance' },
                ].map(b => (
                  <div key={b.label} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{b.icon}</span>
                      <div>
                        <p className="font-medium text-gray-700 text-sm">{b.label}</p>
                        <p className="text-xs text-gray-400">{b.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-pluto-600 rounded-full peer transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'notes' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><StickyNote size={14} className="text-pluto-600"/>Notes</h3>
            <p className="text-xs text-gray-400 mb-2">Confidential notes visible to admins only. Use for context, observations, performance notes.</p>
            <textarea defaultValue={member.notes} rows={8}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none" />
            <button className="mt-3 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">Save</button>
          </div>
        )}
      </main>
    </>
  )
}
