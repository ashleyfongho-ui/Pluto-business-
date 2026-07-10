import { useState } from 'react'
import { X, GitBranch } from 'lucide-react'
import { useData, type Deal } from '../../context/DataContext'

interface Props { onClose: () => void }

const stages = ['Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] as const

export default function NewDealModal({ onClose }: Props) {
  const { deals, addDeal, orgs, systemUsers } = useData()
  const [form, setForm] = useState({
    title: '', orgId: '', value: '', stage: 'Qualified' as typeof stages[number],
    owner: systemUsers[0].id, dueDate: '', notes: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const save = () => {
    if (!form.title.trim()) return
    setSaving(true)
    const newId = Math.max(0, ...deals.map(d => d.id)) + 1
    const deal: Deal = {
      id: newId,
      name: form.title.trim(),
      orgId: Number(form.orgId) || 0,
      contactId: 0,
      stage: form.stage,
      value: Number(form.value.replace(/\D/g, '')) || 0,
      age: 0,
      owner: form.owner,
      lineItems: [],
      notes: form.notes,
      reminders: form.dueDate
        ? [{ id: `r-${newId}`, date: form.dueDate, assignedTo: form.owner, note: 'Follow up on deal' }]
        : [],
    }
    addDeal(deal)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <GitBranch size={16} className="text-violet-700" />
            </div>
            <h2 className="font-semibold text-gray-900">New Deal</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Deal Title *</label>
            <input
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
              placeholder="e.g. Pharma Plus — Q4 Supply"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Organisation</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.orgId} onChange={e => set('orgId', e.target.value)}>
                <option value="">Select org</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Stage</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.stage} onChange={e => set('stage', e.target.value as typeof stages[number])}>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Value (CFA)</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                placeholder="e.g. 500000" value={form.value} onChange={e => set('value', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Owner</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.owner} onChange={e => set('owner', e.target.value)}>
                {systemUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Due Date / Follow-up</label>
            <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
              value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none"
              rows={2} placeholder="Key context, decision makers, blockers…"
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={save} disabled={!form.title.trim() || saving}
            className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Saving…' : 'Create Deal'}
          </button>
        </div>
      </div>
    </div>
  )
}
