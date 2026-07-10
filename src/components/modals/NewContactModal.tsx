import { useState } from 'react'
import { X, UserPlus } from 'lucide-react'
import { useData, type Contact } from '../../context/DataContext'

interface Props { onClose: () => void }

const roleOptions = [
  'Director', 'CEO', 'CFO', 'COO', 'Operations Manager', 'Procurement',
  'Sales Manager', 'HR Manager', 'Finance Officer', 'Field Rep', 'Other',
]

export default function NewContactModal({ onClose }: Props) {
  const { contacts, addContact, orgs } = useData()
  const [form, setForm] = useState({
    name: '', role: roleOptions[0], phone: '', email: '', whatsapp: '', orgId: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const save = () => {
    if (!form.name.trim()) return
    setSaving(true)
    const newId = Math.max(0, ...contacts.map(c => c.id)) + 1
    const linkedOrg = orgs.find(o => o.id === Number(form.orgId))
    const contact: Contact = {
      id: newId,
      orgId: linkedOrg ? linkedOrg.id : 0,
      name: form.name.trim(),
      role: form.role,
      phone: form.phone,
      email: form.email,
      country: linkedOrg?.country ?? 'CM',
      city: linkedOrg?.city ?? '',
      address: '',
      lastContact: 'Just now',
      ownedBy: 'u1',
      notes: '',
      conversations: [],
    }
    addContact(contact)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <UserPlus size={16} className="text-blue-700" />
            </div>
            <h2 className="font-semibold text-gray-900">New Contact</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Full Name *</label>
            <input
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
              placeholder="e.g. Jean-Pierre Kamga"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Role / Title</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.role} onChange={e => set('role', e.target.value)}>
                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Organisation</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.orgId} onChange={e => set('orgId', e.target.value)}>
                <option value="">No organisation</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
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
              <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                placeholder="+237 6XX XXX XXX" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
              placeholder="name@company.cm" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={save} disabled={!form.name.trim() || saving}
            className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Saving…' : 'Create Contact'}
          </button>
        </div>
      </div>
    </div>
  )
}
