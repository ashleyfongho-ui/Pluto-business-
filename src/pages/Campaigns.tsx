import { useState } from 'react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { campaigns, campaignTemplates, contacts, organisations, inventory } from '../data/mockData'
import { Upload, X, Megaphone, MessageSquare, Mail, Users, BarChart2, Send, ChevronRight, Plus, Package, Eye, Clock, CheckCircle } from 'lucide-react'

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Completed: 'bg-gray-100 text-gray-600',
  Draft: 'bg-amber-100 text-amber-700',
}

export default function Campaigns() {
  const { t } = useLang()
  const [showImport, setShowImport] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [activeTab, setActiveTab] = useState<'campaigns' | 'commslog' | 'templates'>('campaigns')
  const [newStep, setNewStep] = useState<1|2|3>(1)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'WhatsApp',
    targetSegment: 'all',
    subject: '',
    message: '',
    scheduledDate: '',
    linkedProduct: '',
  })

  return (
    <>
      <TopBar title={t('campaigns')} />
      <main className="p-6 space-y-6">
        {/* Main tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {([['campaigns','Campaigns'],['commslog','Comms Log'],['templates','Templates']] as const).map(([key,label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === key ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-pluto-200 text-pluto-600 rounded-lg text-sm font-medium hover:bg-pluto-50 transition-colors">
              <Upload size={13} />{t('import list')}
            </button>
            <button onClick={() => setShowNew(true)} className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ New Campaign</button>
          </div>
        </div>

        {/* Campaigns tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Campaign</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Sent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Opened</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Clicks</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              </tr></thead>
              <tbody>{campaigns.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">{c.type}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-gray-500">{c.sent}</td>
                  <td className="px-4 py-3 text-gray-500">{c.opened || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.clicks || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{c.date}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* Comms Log tab */}
        {activeTab === 'commslog' && (
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                <option>All organisations</option>
                {organisations.map(o => <option key={o.id}>{o.name}</option>)}
              </select>
              <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                <option>All contacts</option>
                {contacts.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
              <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                <option>All channels</option>
                <option>WhatsApp</option>
                <option>Email</option>
                <option>SMS</option>
              </select>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Contact / Org</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Campaign</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Channel</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Sent</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { contact: 'Jean-Pierre Kamga', org: 'Pharma Plus', campaign: 'Q3 Pharmacy Outreach', channel: 'Email', sent: '2026-07-01 09:12', status: 'Opened', product: 'Paracetamol 500mg' },
                    { contact: 'Marie Ngo', org: 'Biyem Clinic', campaign: 'Q3 Pharmacy Outreach', channel: 'Email', sent: '2026-07-01 09:12', status: 'Clicked', product: 'Paracetamol 500mg' },
                    { contact: 'Paul Mbarga', org: 'Moda Distribution', campaign: 'Q3 Pharmacy Outreach', channel: 'Email', sent: '2026-07-01 09:12', status: 'Sent', product: null },
                    { contact: 'Cécile Kamga', org: 'Kamga & Sons', campaign: 'Ramadan Promotion', channel: 'WhatsApp', sent: '2026-06-01 08:00', status: 'Opened', product: 'Vitamin C 1000mg' },
                    { contact: 'Henri Fouda', org: 'Étoile Clinic', campaign: 'Ramadan Promotion', channel: 'WhatsApp', sent: '2026-06-01 08:00', status: 'Sent', product: null },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{row.contact}</p>
                        <p className="text-xs text-gray-400">{row.org}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">{row.campaign}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          row.channel === 'WhatsApp' ? 'bg-green-100 text-green-700' :
                          row.channel === 'Email' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>{row.channel}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{row.sent}</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-medium w-fit ${
                          row.status === 'Clicked' ? 'text-pluto-600' :
                          row.status === 'Opened' ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {row.status === 'Clicked' ? <CheckCircle size={11}/> :
                           row.status === 'Opened' ? <Eye size={11}/> :
                           <Clock size={11}/>}
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {row.product ? (
                          <span className="flex items-center gap-1 text-xs text-pluto-600 bg-pluto-50 px-2 py-0.5 rounded w-fit">
                            <Package size={9}/>{row.product}
                          </span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Templates tab */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">{t('templates')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {campaignTemplates.map(tp => (
                <div key={tp.id} className="p-4 rounded-lg border border-pluto-100 bg-pluto-50 hover:border-pluto-300 transition-colors cursor-pointer">
                  <p className="font-medium text-pluto-800 text-sm mb-1">{tp.name}</p>
                  <p className="text-xs text-pluto-600 mb-2">{tp.subject}</p>
                  <p className="text-xs text-gray-400 truncate">{tp.preview}</p>
                  <button className="mt-3 text-xs text-pluto-700 font-medium hover:underline">Use template →</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* New Campaign Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-900">New Campaign</h3>
                <p className="text-xs text-gray-400 mt-0.5">Step {newStep} of 3 — {newStep === 1 ? 'Setup' : newStep === 2 ? 'Message' : 'Audience & Schedule'}</p>
              </div>
              <button onClick={() => { setShowNew(false); setNewStep(1) }} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {/* Step progress */}
            <div className="flex px-6 py-3 gap-2">
              {[1,2,3].map(s => (
                <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= newStep ? 'bg-pluto-600' : 'bg-gray-100'}`} />
              ))}
            </div>

            <div className="px-6 pb-6">
              {newStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Campaign Name</label>
                    <input value={newCampaign.name} onChange={e => setNewCampaign(c => ({...c, name: e.target.value}))}
                      placeholder="e.g. Q3 Pharmacy Outreach"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block">Campaign Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { type: 'WhatsApp', icon: MessageSquare, desc: 'Direct WhatsApp messages', color: 'text-green-600 bg-green-50 border-green-200' },
                        { type: 'Email', icon: Mail, desc: 'Email broadcast', color: 'text-blue-600 bg-blue-50 border-blue-200' },
                        { type: 'SMS', icon: Send, desc: 'SMS bulk send', color: 'text-amber-600 bg-amber-50 border-amber-200' },
                        { type: 'Push', icon: Megaphone, desc: 'App push notification', color: 'text-pluto-600 bg-pluto-50 border-pluto-200' },
                      ].map(opt => (
                        <button key={opt.type} onClick={() => setNewCampaign(c => ({...c, type: opt.type}))}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            newCampaign.type === opt.type ? opt.color + ' ring-2 ring-offset-1 ring-pluto-400' : 'border-gray-100 hover:border-gray-200'
                          }`}>
                          <opt.icon size={16} className={newCampaign.type === opt.type ? '' : 'text-gray-400'} />
                          <p className="font-medium text-gray-900 text-sm mt-1">{opt.type}</p>
                          <p className="text-xs text-gray-400">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setNewStep(2)}
                    disabled={!newCampaign.name}
                    className="w-full py-2.5 bg-pluto-600 text-white rounded-xl text-sm font-medium hover:bg-pluto-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5">
                    Continue <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {newStep === 2 && (
                <div className="space-y-4">
                  {newCampaign.type === 'Email' && (
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Subject Line</label>
                      <input value={newCampaign.subject} onChange={e => setNewCampaign(c => ({...c, subject: e.target.value}))}
                        placeholder="e.g. New products available — exclusive pricing inside"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Message</label>
                    <textarea value={newCampaign.message} onChange={e => setNewCampaign(c => ({...c, message: e.target.value}))}
                      rows={6}
                      placeholder={newCampaign.type === 'WhatsApp' ? 'Hello {{name}}, we have an exclusive offer for you…' : 'Write your campaign message here…'}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none" />
                    <p className="text-xs text-gray-400 mt-1">Use {'{{name}}'} to personalise with contact name</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">Quick Templates</p>
                    <div className="space-y-1">
                      {campaignTemplates.slice(0,3).map(tp => (
                        <button key={tp.id} onClick={() => setNewCampaign(c => ({...c, subject: tp.subject, message: tp.preview}))}
                          className="w-full text-left text-xs text-pluto-600 hover:text-pluto-800 py-1 flex items-center gap-1.5">
                          <Plus size={10} /> {tp.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setNewStep(1)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Back</button>
                    <button onClick={() => setNewStep(3)} className="flex-1 py-2 bg-pluto-600 text-white rounded-xl text-sm font-medium hover:bg-pluto-700 flex items-center justify-center gap-1.5">
                      Continue <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {newStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block">Target Audience</label>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: `All contacts (${contacts.length})`, icon: Users },
                        { value: 'pharmacies', label: `Pharmacies (${organisations.filter(o => o.sector === 'Pharmacy').length} orgs)`, icon: Users },
                        { value: 'healthcare', label: `Healthcare orgs (${organisations.filter(o => o.sector === 'Healthcare').length} orgs)`, icon: Users },
                        { value: 'custom', label: 'Custom segment (tag/filter)', icon: BarChart2 },
                      ].map(seg => (
                        <label key={seg.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          newCampaign.targetSegment === seg.value ? 'border-pluto-300 bg-pluto-50' : 'border-gray-100 hover:border-gray-200'
                        }`}>
                          <input type="radio" value={seg.value} checked={newCampaign.targetSegment === seg.value}
                            onChange={e => setNewCampaign(c => ({...c, targetSegment: e.target.value}))}
                            className="accent-pluto-600" />
                          <seg.icon size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{seg.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Schedule Send</label>
                    <input type="datetime-local" value={newCampaign.scheduledDate}
                      onChange={e => setNewCampaign(c => ({...c, scheduledDate: e.target.value}))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    <p className="text-xs text-gray-400 mt-1">Leave blank to save as draft</p>
                  </div>
                  {/* Link to product */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1"><Package size={10}/> Link to Inventory Item (optional)</label>
                    <select value={newCampaign.linkedProduct} onChange={e => setNewCampaign(c => ({...c, linkedProduct: e.target.value}))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                      <option value="">— No product link</option>
                      {inventory.map(item => <option key={item.id} value={item.name}>{item.name} ({item.sku})</option>)}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Linked campaigns appear on the product page in Inventory</p>
                  </div>

                  <div className="bg-pluto-50 rounded-xl p-4 border border-pluto-100">
                    <p className="text-xs font-semibold text-pluto-700 mb-2">Campaign Summary</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>📢 <strong>{newCampaign.name}</strong> via {newCampaign.type}</p>
                      <p>👥 {newCampaign.targetSegment === 'all' ? `All ${contacts.length} contacts` : newCampaign.targetSegment}</p>
                      {newCampaign.linkedProduct && <p><Package size={10} className="inline mr-1"/>{newCampaign.linkedProduct}</p>}
                      {newCampaign.scheduledDate && <p>📅 Scheduled: {new Date(newCampaign.scheduledDate).toLocaleString()}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setNewStep(2)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Back</button>
                    <button onClick={() => { setShowNew(false); setNewStep(1) }} className="py-2 px-4 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Save Draft</button>
                    <button onClick={() => { setShowNew(false); setNewStep(1) }} className="flex-1 py-2 bg-pluto-600 text-white rounded-xl text-sm font-medium hover:bg-pluto-700 flex items-center justify-center gap-1.5">
                      <Send size={13} /> Launch Campaign
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Import Contact List (CSV)</h3>
              <button onClick={() => setShowImport(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="border-2 border-dashed border-pluto-200 rounded-xl p-8 text-center mb-4 bg-pluto-50 hover:bg-pluto-100 transition-colors cursor-pointer">
              <Upload size={24} className="text-pluto-400 mx-auto mb-2" />
              <p className="text-sm text-pluto-700 font-medium">Drop CSV file here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">Supports .csv files up to 10MB</p>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Column Mapping</p>
              {['Name', 'Phone', 'Email', 'Organisation', 'City'].map(col => (
                <div key={col} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-24">{col}</span>
                  <select className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-500">
                    <option>Select column…</option>
                    <option>Column A</option>
                    <option>Column B</option>
                    <option>Column C</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowImport(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">{t('cancel')}</button>
              <button onClick={() => setShowImport(false)} className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">Import</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
