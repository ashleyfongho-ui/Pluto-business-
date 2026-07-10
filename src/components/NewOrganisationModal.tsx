import { useState } from 'react'
import { X, Building2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { sectorOptions, paymentTermOptions, countryOptions, systemUsers } from '../data/mockData'

interface Props {
  onClose: () => void
  onCreated?: (id: number) => void
}

export default function NewOrganisationModal({ onClose, onCreated }: Props) {
  const { addOrganisation } = useApp()
  const [form, setForm] = useState({
    name: '', sector: sectorOptions[9], country: 'CM', city: '',
    address: '', phone: '', email: '', website: '',
    paymentTerms: 'Net 30', paymentTermsCustom: '',
    ownedBy: 'u1', teamRelevance: 'u1',
    parentOrgId: null as number | null, notes: '',
  })

  const cities = countryOptions.find(c => c.code === form.country)?.cities || []

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const org = addOrganisation(form)
    onCreated?.(org.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pluto-100 flex items-center justify-center">
              <Building2 size={16} className="text-pluto-600" />
            </div>
            <h2 className="font-bold text-gray-900">New Organisation</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Organisation Name *</label>
            <input
              autoFocus
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Pharma Centrale Yaoundé"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 focus:border-pluto-400"
              required
            />
          </div>

          {/* Sector + Payment Terms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sector</label>
              <select value={form.sector} onChange={e => set('sector', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                {sectorOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Payment Terms</label>
              <select value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                {paymentTermOptions.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Country + City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
              <select value={form.country} onChange={e => { set('country', e.target.value); set('city', '') }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                {countryOptions.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
              <select value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                <option value="">Select city…</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+237 6 XX XX XX XX"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="contact@company.cm"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Website</label>
              <input value={form.website} onChange={e => set('website', e.target.value)}
                placeholder="www.company.cm"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="Street address"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
            </div>
          </div>

          {/* Owner */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Account Owner</label>
              <select value={form.ownedBy} onChange={e => set('ownedBy', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                {systemUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Team Relevance</label>
              <select value={form.teamRelevance} onChange={e => set('teamRelevance', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                {systemUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Key context about this organisation…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 bg-pluto-600 text-white rounded-xl text-sm font-semibold hover:bg-pluto-700 transition-colors">
              Create Organisation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
