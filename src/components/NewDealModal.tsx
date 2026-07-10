import { useState } from 'react'
import { X, GitBranch } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { systemUsers } from '../data/mockData'

const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']

interface Props {
  onClose: () => void
  defaultOrgId?: number
  onCreated?: (id: number) => void
}

export default function NewDealModal({ onClose, defaultOrgId, onCreated }: Props) {
  const { addDeal, organisations } = useApp()
  const [form, setForm] = useState({
    name: '',
    orgId: defaultOrgId || (organisations[0]?.id ?? 0),
    contactId: 0,
    stage: 'Qualified',
    value: '',
    owner: 'u1',
    notes: '',
    dueDate: '',
  })

  const set = (key: string, val: string | number) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.value) return
    const deal = addDeal({
      name: form.name,
      orgId: Number(form.orgId),
      contactId: Number(form.contactId),
      stage: form.stage,
      value: Number(form.value),
      owner: form.owner,
      notes: form.notes,
    })
    onCreated?.(deal.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <GitBranch size={16} className="text-violet-600" />
            </div>
            <h2 className="font-bold text-gray-900">New Deal</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Deal Name *</label>
            <input autoFocus value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Pharma Plus — Q4 Supply Contract"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Organisation</label>
              <select value={form.orgId} onChange={e => set('orgId', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                {organisations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Stage</label>
              <select value={form.stage} onChange={e => set('stage', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                {stages.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Value (CFA) *</label>
              <input type="number" value={form.value} onChange={e => set('value', e.target.value)}
                placeholder="e.g. 500000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Expected Close</label>
              <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Deal Owner</label>
            <select value={form.owner} onChange={e => set('owner', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
              {systemUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Key context, next steps, blockers…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 bg-pluto-600 text-white rounded-xl text-sm font-semibold hover:bg-pluto-700 transition-colors">
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
