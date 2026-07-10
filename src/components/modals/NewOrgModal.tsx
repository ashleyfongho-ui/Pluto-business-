import { useState } from 'react'
import { X, Building2 } from 'lucide-react'
import { useData, type Org } from '../../context/DataContext'

interface Props { onClose: () => void }

export default function NewOrgModal({ onClose }: Props) {
  const { orgs, addOrg, sectorOptions, countryOptions, paymentTermOptions, systemUsers } = useData()
  const [form, setForm] = useState({
    name: '', sector: sectorOptions[0], country: 'CM', city: '',
    phone: '', email: '', website: '', paymentTerms: paymentTermOptions[0],
    ownedBy: systemUsers[0].id,
  })
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const cities = countryOptions.find(c => c.code === form.country)?.cities ?? []

  const save = () => {
    if (!form.name.trim()) return
    setSaving(true)
    const newId = Math.max(0, ...orgs.map(o => o.id)) + 1
    const org: Org = {
      id: newId,
      name: form.name.trim(),
      sector: form.sector,
      country: form.country,
      city: form.city || (cities[0] ?? ''),
      address: '',
      phone: form.phone,
      email: form.email,
      website: form.website,
      outstanding: 0,
      lastActivity: 'Just now',
      paymentTerms: form.paymentTerms,
      paymentTermsCustom: '',
      ownedBy: form.ownedBy,
      teamRelevance: form.ownedBy,
      parentOrgId: null,
      notes: '',
      invoiceDetails: { vatNumber: '', bankName: '', accountNumber: '', swift: '' },
      customFields: {},
      tags: [],
    }
    addOrg(org)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pluto-100 flex items-center justify-center">
              <Building2 size={16} className="text-pluto-700" />
            </div>
            <h2 className="font-semibold text-gray-900">New Organisation</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Organisation Name *</label>
            <input
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 focus:border-pluto-400"
              placeholder="e.g. Pharma Plus"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sector</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.sector} onChange={e => set('sector', e.target.value)}>
                {sectorOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Payment Terms</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)}>
                {paymentTermOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.country} onChange={e => { set('country', e.target.value); set('city', '') }}>
                {countryOptions.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.city} onChange={e => set('city', e.target.value)}>
                <option value="">Select city</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                placeholder="+237 6XX XXX XXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                placeholder="contact@company.cm" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                placeholder="company.cm" value={form.website} onChange={e => set('website', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Assigned Owner</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.ownedBy} onChange={e => set('ownedBy', e.target.value)}>
                {systemUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={save} disabled={!form.name.trim() || saving}
            className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Saving…' : 'Create Organisation'}
          </button>
        </div>
      </div>
    </div>
  )
}
