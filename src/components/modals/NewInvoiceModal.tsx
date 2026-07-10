import { useState } from 'react'
import { X, Receipt, Plus, Trash2 } from 'lucide-react'
import { useData, type Invoice } from '../../context/DataContext'

interface Props { onClose: () => void }

type LineItem = { id: string; description: string; amount: number }

export default function NewInvoiceModal({ onClose }: Props) {
  const { invoices, addInvoice, orgs } = useData()
  const [form, setForm] = useState({
    orgId: '', dueDate: '',
  })
  const [items, setItems] = useState<LineItem[]>([
    { id: 'item-1', description: '', amount: 0 },
  ])
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const totalAmount = items.reduce((s, i) => s + (i.amount || 0), 0)

  const updateItem = (id: string, k: keyof LineItem, v: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [k]: v } : i))
  }
  const addItem = () => {
    setItems(prev => [...prev, { id: `item-${Date.now()}`, description: '', amount: 0 }])
  }
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const getNextId = () => {
    const nums = invoices.map(i => parseInt(i.id.replace('INV-', ''), 10)).filter(n => !isNaN(n))
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
    return `INV-${String(next).padStart(3, '0')}`
  }

  const save = () => {
    if (!form.orgId || !form.dueDate || totalAmount === 0) return
    setSaving(true)
    const inv: Invoice = {
      id: getNextId(),
      orgId: Number(form.orgId),
      dealId: null,
      amount: totalAmount,
      dueDate: form.dueDate,
      status: 'draft',
      paymentRef: null,
      paidVia: null,
      paidAt: null,
      reminders: [],
      paymentLink: `https://pay.plutobusiness.cm/inv/${getNextId()}`,
      lineItems: items.filter(i => i.description.trim()).map(i => ({ description: i.description, amount: i.amount })),
      templateUsed: 'Standard Invoice',
    }
    addInvoice(inv)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Receipt size={16} className="text-green-700" />
            </div>
            <h2 className="font-semibold text-gray-900">New Invoice</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Organisation *</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.orgId} onChange={e => set('orgId', e.target.value)}>
                <option value="">Select org</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Due Date *</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-500">Line Items</label>
              <button onClick={addItem} className="flex items-center gap-1 text-xs text-pluto-600 hover:text-pluto-800 font-medium">
                <Plus size={12} /> Add line
              </button>
            </div>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                    placeholder="Description"
                    value={item.description}
                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                  />
                  <input
                    className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 text-right"
                    placeholder="Amount"
                    type="number"
                    value={item.amount || ''}
                    onChange={e => updateItem(item.id, 'amount', Number(e.target.value))}
                  />
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {totalAmount > 0 && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Total</span>
                <span className="text-sm font-bold text-gray-900">{totalAmount.toLocaleString()} CFA</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={save} disabled={!form.orgId || !form.dueDate || totalAmount === 0 || saving}
            className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Saving…' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </div>
  )
}
