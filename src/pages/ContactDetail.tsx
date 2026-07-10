import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Send, StickyNote, Building2 } from 'lucide-react'
import TopBar from '../components/TopBar'
import { contacts, organisations, systemUsers, campaigns } from '../data/mockData'

const convTypeColors: Record<string, string> = {
  WhatsApp: 'bg-green-100 text-green-700',
  Email: 'bg-blue-100 text-blue-700',
  Call: 'bg-purple-100 text-purple-700',
  Meeting: 'bg-amber-100 text-amber-700',
  Manual: 'bg-gray-100 text-gray-600',
}

const convTypes = ['WhatsApp', 'Email', 'Call', 'Meeting', 'Manual note']

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const contact = contacts.find(c => c.id === Number(id))
  const [showLog, setShowLog] = useState(false)
  const [newConv, setNewConv] = useState({ type: 'WhatsApp', direction: 'outbound', summary: '' })

  if (!contact) return (
    <><TopBar title="Contact not found" /><main className="p-6"><p className="text-gray-400">Contact not found.</p></main></>
  )

  const org = organisations.find(o => o.id === contact.orgId)
  const owner = systemUsers.find(u => u.id === contact.ownedBy)

  return (
    <>
      <TopBar title={contact.name} />
      <main className="p-6 max-w-4xl">
        <button onClick={() => navigate('/contacts')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to Contacts
        </button>

        <div className="grid grid-cols-3 gap-4">
          {/* Left: profile */}
          <div className="col-span-1 space-y-4">
            {/* Profile card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-2xl font-bold mb-3">
                  {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h2 className="font-bold text-gray-900 text-lg">{contact.name}</h2>
                <p className="text-sm text-gray-500">{contact.role}</p>
                {org && (
                  <Link to={`/organisations/${org.id}`}
                    className="flex items-center gap-1 text-xs text-pluto-600 hover:text-pluto-800 mt-1 font-medium">
                    <Building2 size={11} />{org.name}
                  </Link>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone size={14} className="text-pluto-500" /><span className="text-gray-700">{contact.phone}</span>
                </a>
                <a href={`https://wa.me/${contact.phone.replace(/\s+/g, '').replace('+', '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition-colors">
                  <MessageCircle size={14} className="text-green-500" />
                  <span className="text-gray-700 text-xs">WhatsApp</span>
                  <span className="ml-auto text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">Open</span>
                </a>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail size={14} className="text-pluto-500" /><span className="text-gray-700 text-xs">{contact.email}</span>
                </a>
                <div className="flex items-center gap-2 p-2">
                  <MapPin size={14} className="text-gray-400" /><span className="text-gray-500 text-xs">{contact.city}, {contact.country}</span>
                </div>
              </div>
            </div>

            {/* Attribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Account Owner</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold">{owner?.avatar}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{owner?.name}</p>
                  <p className="text-xs text-gray-400">{owner?.role}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm"><StickyNote size={13} className="text-pluto-600"/>Notes</h3>
              <textarea defaultValue={contact.notes} rows={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none" />
              <button className="mt-2 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700 transition-colors">Save</button>
            </div>
          </div>

          {/* Right: conversation timeline */}
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle size={15} className="text-pluto-600" />
                  Conversation History
                </h3>
                <button onClick={() => setShowLog(!showLog)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700 transition-colors">
                  <Send size={11} />
                  Log Interaction
                </button>
              </div>

              {/* Log new interaction */}
              {showLog && (
                <div className="px-5 py-4 bg-pluto-50 border-b border-pluto-100">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <select value={newConv.type} onChange={e => setNewConv({...newConv, type: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-pluto-300">
                        {convTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Direction</p>
                      <select value={newConv.direction} onChange={e => setNewConv({...newConv, direction: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-pluto-300">
                        <option value="outbound">Outbound (we contacted them)</option>
                        <option value="inbound">Inbound (they contacted us)</option>
                        <option value="both">Meeting / Both</option>
                      </select>
                    </div>
                  </div>
                  <textarea value={newConv.summary} onChange={e => setNewConv({...newConv, summary: e.target.value})}
                    placeholder="What was discussed? Key outcomes, promises made, next steps…"
                    rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-pluto-300 resize-none mb-2" />
                  <div className="flex gap-2">
                    <button onClick={() => setShowLog(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                    <button onClick={() => setShowLog(false)} className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700 transition-colors">Save Interaction</button>
                  </div>
                </div>
              )}

              {/* Timeline — manual convos + campaign comms */}
              {(() => {
                // Inject campaign comms as conversation entries
                const campaignEntries = campaigns
                  .filter(c => c.status !== 'Draft' && c.sent > 0)
                  .slice(0, 2)
                  .map((c, i) => ({
                    id: `camp-${c.id}`,
                    date: c.date + ' 09:00',
                    type: c.type,
                    direction: 'outbound',
                    summary: `Campaign: "${c.name}" — ${c.sent} sent, ${c.opened || 0} opened, ${c.clicks || 0} clicked`,
                    user: 'u1',
                    isCampaign: true,
                  }))
                const allEntries = [...(contact.conversations as typeof campaignEntries), ...campaignEntries]
                  .sort((a, b) => b.date.localeCompare(a.date))
                return (
                  <div className="divide-y divide-gray-50">
                    {allEntries.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-8">No interactions logged yet.</p>
                    ) : (
                      allEntries.map(cv => {
                        const user = systemUsers.find(u => u.id === cv.user)
                        const isCamp = 'isCampaign' in cv && cv.isCampaign
                        return (
                          <div key={cv.id} className={`px-5 py-4 hover:bg-gray-50 ${isCamp ? 'bg-violet-50/40' : ''}`}>
                            <div className="flex items-center gap-2 mb-1.5">
                              {isCamp && <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">📢 Campaign</span>}
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${convTypeColors[cv.type] || 'bg-gray-100 text-gray-600'}`}>
                                {cv.type}
                              </span>
                              <span className="text-xs text-gray-400 ml-auto">{cv.date}</span>
                              {user && <span className="text-xs text-gray-400">· {user.name}</span>}
                            </div>
                            <p className="text-sm text-gray-700">{cv.summary}</p>
                          </div>
                        )
                      })
                    )}
                  </div>
                )
              })()}
            </div>

            {/* WhatsApp note */}
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl border border-green-100 text-xs text-green-700">
              <MessageCircle size={13} />
              <span><strong>WhatsApp integration:</strong> When connected, messages sent via Pluto will auto-log here. For now, log manually above.</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
