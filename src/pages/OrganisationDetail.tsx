import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, Building2, MapPin, Phone, Mail, Globe, User,
  FileText, CreditCard, StickyNote, ChevronRight, GitBranch, Plus, Trash2, Settings
} from 'lucide-react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import {
  organisations, contacts, deals, invoices,
  sectorOptions, paymentTermOptions, countryOptions, systemUsers
} from '../data/mockData'

export default function OrganisationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const org = organisations.find(o => o.id === Number(id))
  const [tab, setTab] = useState<'overview' | 'contacts' | 'deals' | 'invoices' | 'notes' | 'tree'>('overview')
  const [editing, setEditing] = useState(false)
  const [paymentTermCustom, setPaymentTermCustom] = useState(org?.paymentTermsCustom || '')
  const [selectedCountry, setSelectedCountry] = useState(org?.country || 'CM')
  const [customFields, setCustomFields] = useState<{key: string; value: string}[]>(
    Object.entries(org?.customFields || {}).map(([key, value]) => ({ key, value: String(value) }))
  )
  const [addingField, setAddingField] = useState(false)
  const [newFieldKey, setNewFieldKey] = useState('')
  const [customCity, setCustomCity] = useState('')
  const [cityInputMode, setCityInputMode] = useState<'select' | 'custom'>('select')
  const currentCountryData = countryOptions.find(c => c.code === selectedCountry)

  if (!org) return (
    <><TopBar title="Organisation not found" /><main className="p-6"><p className="text-gray-400">Organisation not found.</p></main></>
  )

  const orgContacts = contacts.filter(c => c.orgId === org.id)
  const orgDeals = deals.filter(d => d.orgId === org.id)
  const orgInvoices = invoices.filter(i => i.orgId === org.id)
  const owner = systemUsers.find(u => u.id === org.ownedBy)
  const team = systemUsers.find(u => u.id === org.teamRelevance)
  const country = countryOptions.find(c => c.code === org.country)
  const totalOutstanding = orgInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0)

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'contacts', label: `Contacts (${orgContacts.length})` },
    { key: 'deals', label: `Deals (${orgDeals.length})` },
    { key: 'invoices', label: `Invoices (${orgInvoices.length})` },
    { key: 'notes', label: 'Notes' },
    { key: 'tree', label: 'Org Tree' },
  ] as const

  return (
    <>
      <TopBar title={org.name} />
      <main className="p-6 max-w-5xl">
        {/* Back */}
        <button onClick={() => navigate('/organisations')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to Organisations
        </button>

        {/* Header card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-pluto-100 text-pluto-700 flex items-center justify-center text-xl font-black">
                {org.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-pluto-100 text-pluto-700 text-xs font-medium rounded-full">{org.sector}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11} />{org.city}, {country?.name}</span>
                  {org.phone && <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={11} />{org.phone}</span>}
                  {org.email && <span className="flex items-center gap-1 text-xs text-gray-400"><Mail size={11} />{org.email}</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-500">{totalOutstanding.toLocaleString()} CFA</p>
              <p className="text-xs text-gray-400">outstanding</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100">
            <div><p className="text-xs text-gray-400">Contacts</p><p className="font-bold text-gray-900">{orgContacts.length}</p></div>
            <div><p className="text-xs text-gray-400">Active deals</p><p className="font-bold text-gray-900">{orgDeals.filter(d=>!['Won','Lost'].includes(d.stage)).length}</p></div>
            <div><p className="text-xs text-gray-400">Payment terms</p><p className="font-bold text-gray-900">{org.paymentTerms === 'Other' ? paymentTermCustom || 'Custom' : org.paymentTerms}</p></div>
            <div><p className="text-xs text-gray-400">Owner</p><p className="font-bold text-gray-900">{owner?.name || '—'}</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-4">
          {tabs.map(tab_ => (
            <button key={tab_.key} onClick={() => setTab(tab_.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${tab === tab_.key ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab_.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building2 size={15} className="text-pluto-600"/>Organisation Details</h3>
              <div className="space-y-3 text-sm">
                <div><p className="text-xs text-gray-400 mb-0.5">Sector</p>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                    {sectorOptions.map(s => <option key={s} selected={s === org.sector}>{s}</option>)}
                  </select>
                </div>
                <div><p className="text-xs text-gray-400 mb-0.5">Country</p>
                  <select value={selectedCountry} onChange={e => { setSelectedCountry(e.target.value); setCityInputMode('select'); setCustomCity('') }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                    {countryOptions.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs text-gray-400">City</p>
                    <button onClick={() => setCityInputMode(m => m === 'select' ? 'custom' : 'select')}
                      className="text-xs text-pluto-500 hover:text-pluto-700">
                      {cityInputMode === 'select' ? '+ Custom city' : '← Pick from list'}
                    </button>
                  </div>
                  {cityInputMode === 'select' ? (
                    <select defaultValue={org.city} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                      {currentCountryData?.cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input value={customCity} onChange={e => setCustomCity(e.target.value)}
                      placeholder="Enter city name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                  )}
                </div>
                <div><p className="text-xs text-gray-400 mb-0.5">Address</p>
                  <input defaultValue={org.address} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
                <div><p className="text-xs text-gray-400 mb-0.5">Phone</p>
                  <input defaultValue={org.phone} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
                <div><p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <input defaultValue={org.email} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
                <div><p className="text-xs text-gray-400 mb-0.5">Website</p>
                  <input defaultValue={org.website} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Payment terms */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><CreditCard size={15} className="text-pluto-600"/>Payment Terms</h3>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 mb-2">
                  {paymentTermOptions.map(p => <option key={p} selected={p === org.paymentTerms}>{p}</option>)}
                </select>
                {org.paymentTerms === 'Other' && (
                  <input placeholder="Describe custom terms…" defaultValue={org.paymentTermsCustom}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                )}
              </div>

              {/* Invoice details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><FileText size={15} className="text-pluto-600"/>Invoice Details</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'VAT / Tax Number', value: org.invoiceDetails.vatNumber },
                    { label: 'Bank Name', value: org.invoiceDetails.bankName },
                    { label: 'Account Number', value: org.invoiceDetails.accountNumber },
                    { label: 'SWIFT / BIC', value: org.invoiceDetails.swift },
                  ].map(f => (
                    <div key={f.label}><p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                      <input defaultValue={f.value} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Attributed user */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><User size={15} className="text-pluto-600"/>Team Attribution</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Account Owner</p>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                      {systemUsers.map(u => <option key={u.id} selected={u.id === org.ownedBy}>{u.name} — {u.role}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Team / Rep Responsible</p>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                      {systemUsers.map(u => <option key={u.id} selected={u.id === org.teamRelevance}>{u.name} — {u.role}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom fields */}
            <div className="col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Settings size={14} className="text-pluto-600"/>Custom Fields</h3>
                  <button onClick={() => setAddingField(true)} className="flex items-center gap-1 text-xs text-pluto-600 hover:text-pluto-800 font-medium">
                    <Plus size={12} /> Add Field
                  </button>
                </div>
                <div className="space-y-2">
                  {customFields.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-28 shrink-0 font-medium">{f.key}</span>
                      <input value={f.value} onChange={e => setCustomFields(prev => prev.map((x, j) => j === i ? {...x, value: e.target.value} : x))}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300" />
                      <button onClick={() => setCustomFields(prev => prev.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {addingField && (
                    <div className="flex items-center gap-2 pt-1">
                      <input value={newFieldKey} onChange={e => setNewFieldKey(e.target.value)}
                        placeholder="Field name (e.g. Tax Region)"
                        className="flex-1 border border-pluto-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300" />
                      <button onClick={() => { if(newFieldKey.trim()) { setCustomFields(prev => [...prev, {key: newFieldKey.trim(), value: ''}]); setNewFieldKey(''); setAddingField(false) } }}
                        className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700">Add</button>
                      <button onClick={() => { setAddingField(false); setNewFieldKey('') }} className="text-gray-400 hover:text-gray-600"><Trash2 size={14}/></button>
                    </div>
                  )}
                  {customFields.length === 0 && !addingField && (
                    <p className="text-xs text-gray-400 text-center py-2">No custom fields. Click + Add Field to create one.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <button className="px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">Save Changes</button>
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {tab === 'contacts' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{orgContacts.length} contact{orgContacts.length !== 1 ? 's' : ''} at {org.name}</p>
              <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ Add Contact</button>
            </div>
            {orgContacts.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No contacts yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {orgContacts.map(c => (
                  <Link key={c.id} to={`/contacts/${c.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-sm font-bold">
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-pluto-700 transition-colors">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.role} · {c.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">Last contact: {c.lastContact}</span>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-pluto-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DEALS */}
        {tab === 'deals' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{orgDeals.length} deal{orgDeals.length !== 1 ? 's' : ''}</p>
              <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ New Deal</button>
            </div>
            {orgDeals.map(d => (
              <Link key={d.id} to={`/pipeline/${d.id}`}
                className="flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-pluto-700 transition-colors">{d.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{d.age} days old · {d.lineItems.length} line item{d.lineItems.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    d.stage === 'Won' ? 'bg-green-100 text-green-700' :
                    d.stage === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-pluto-100 text-pluto-700'
                  }`}>{d.stage}</span>
                  <span className="font-semibold text-gray-900">{(d.value / 1000).toFixed(0)}K CFA</span>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* INVOICES */}
        {tab === 'invoices' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm text-gray-500">{orgInvoices.length} invoice{orgInvoices.length !== 1 ? 's' : ''}</p>
            </div>
            {orgInvoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50">
                <div>
                  <p className="font-mono font-medium text-pluto-700">{inv.id}</p>
                  <p className="text-xs text-gray-400">Due {inv.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                    inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                    inv.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>{inv.status}</span>
                  <span className="font-semibold text-gray-900">{inv.amount.toLocaleString()} CFA</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTES */}
        {tab === 'notes' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><StickyNote size={15} className="text-pluto-600"/>Notes</h3>
            <p className="text-xs text-gray-400 mb-2">Use this for anything relevant — holidays, personal details, previous staff, context.</p>
            <textarea defaultValue={org.notes} rows={8}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none" />
            <button className="mt-3 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">Save Note</button>
          </div>
        )}

        {/* ORG TREE */}
        {tab === 'tree' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><GitBranch size={15} className="text-pluto-600"/>Organisation Structure</h3>
            <div className="space-y-4">
              {/* Parent org */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Parent Organisation</p>
                {org.parentOrgId ? (
                  <div className="flex items-center gap-2 p-3 bg-pluto-50 rounded-lg border border-pluto-100">
                    <Building2 size={14} className="text-pluto-600" />
                    <span className="text-sm font-medium text-pluto-700">{organisations.find(o => o.id === org.parentOrgId)?.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <span className="text-sm text-gray-400">No parent organisation — this is a standalone entity</span>
                    <button className="ml-auto text-xs text-pluto-600 font-medium hover:underline">+ Link parent</button>
                  </div>
                )}
              </div>

              {/* This org */}
              <div className="flex items-center gap-2 p-4 bg-pluto-600 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                  {org.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{org.name}</p>
                  <p className="text-pluto-200 text-xs">{org.sector} · {org.city}</p>
                </div>
                <span className="ml-auto px-2 py-0.5 bg-white/20 text-white text-xs rounded-full font-medium">This org</span>
              </div>

              {/* Subsidiaries */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Subsidiaries / Child Organisations</p>
                {organisations.filter(o => o.parentOrgId === org.id).length > 0 ? (
                  organisations.filter(o => o.parentOrgId === org.id).map(child => (
                    <Link key={child.id} to={`/organisations/${child.id}`}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 mb-2 hover:border-pluto-200 transition-colors">
                      <Building2 size={14} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{child.name}</span>
                      <ChevronRight size={12} className="ml-auto text-gray-300" />
                    </Link>
                  ))
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <span className="text-sm text-gray-400">No subsidiaries</span>
                    <button className="ml-auto text-xs text-pluto-600 font-medium hover:underline">+ Add subsidiary</button>
                  </div>
                )}
              </div>

              {/* Internal team */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Internal Team at this Organisation</p>
                <div className="flex gap-2 flex-wrap">
                  {orgContacts.map(c => (
                    <Link key={c.id} to={`/contacts/${c.id}`}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 hover:border-pluto-200 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold">
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-xs font-medium text-gray-700">{c.name}</span>
                      <span className="text-xs text-gray-400">· {c.role}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
