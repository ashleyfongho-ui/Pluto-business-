import { useState } from 'react'
import { Link2, Bell, CheckCircle, CreditCard, RefreshCw, X, Landmark, Plus, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { invoices as rawInvoices, bankTransactions as initialTxns, connectedBankAccounts, invoiceTemplates, organisations } from '../data/mockData'

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
type Invoice = {
  id: string
  orgId: number
  dealId: number
  amount: number
  dueDate: string
  status: InvoiceStatus
  paymentRef: string | null
  paidVia: string | null
  paidAt: string | null
  reminders: { date: string; type: string }[]
  paymentLink: string
  lineItems: { description: string; amount: number }[]
  templateUsed: string
}
const initialInvoices: Invoice[] = rawInvoices as unknown as Invoice[]

const statusColor: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  sent: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-600',
}

const forecastData = [
  { label: 'Current Balance', value: 3230000, type: 'balance' },
  { label: 'Expected In (30d)', value: 607500, type: 'in' },
  { label: 'Invoices Overdue', value: -450000, type: 'out' },
  { label: 'Projected (30d)', value: 3387500, type: 'projected' },
]

export default function Accounting() {
  const { t } = useLang()
  const [invoices, setInvoices] = useState(initialInvoices)
  const [txns, setTxns] = useState(initialTxns)
  const [tab, setTab] = useState<'invoices' | 'reconciliation' | 'forecasting'>('invoices')
  const [reminderModal, setReminderModal] = useState<Invoice | null>(null)
  const [newInvoiceModal, setNewInvoiceModal] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const markPaid = (id: string) => {
    setInvoices(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'paid', paidAt: new Date().toISOString().split('T')[0], paidVia: 'Manual' } : i
    ))
  }

  const copyLink = (inv: Invoice) => {
    navigator.clipboard?.writeText(inv.paymentLink).catch(() => {})
    setCopied(inv.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const matchTxn = (txnId: string, invoiceId: string) => {
    setTxns(prev => prev.map(t => t.id === txnId ? { ...t, matched: true } : t))
    setInvoices(prev => prev.map(i =>
      i.id === invoiceId ? { ...i, status: 'paid', paidAt: new Date().toISOString().split('T')[0], paidVia: 'Bank Reconciliation', paymentRef: txnId } : i
    ))
  }

  const overdueTotal = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)
  const pendingTotal = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0)
  const paidTotal = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)

  return (
    <>
      <TopBar title="Accounting" />
      <main className="p-6">
        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Paid This Month</p>
            <p className="text-xl font-bold text-green-600">{paidTotal.toLocaleString()} CFA</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Outstanding</p>
            <p className="text-xl font-bold text-blue-600">{pendingTotal.toLocaleString()} CFA</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Overdue</p>
            <p className="text-xl font-bold text-red-500">{overdueTotal.toLocaleString()} CFA</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {(['invoices', 'reconciliation', 'forecasting'] as const).map(k => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${tab === k ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {k === 'reconciliation' ? 'Bank Reconciliation' : k === 'forecasting' ? 'Cash Forecast' : 'Invoices'}
            </button>
          ))}
        </div>

        {/* INVOICES TAB */}
        {tab === 'invoices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                  <option>All statuses</option>
                  <option>Draft</option>
                  <option>Sent</option>
                  <option>Overdue</option>
                  <option>Paid</option>
                </select>
              </div>
              <button onClick={() => setNewInvoiceModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                <Plus size={13} /> Raise Invoice
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Invoice</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Organisation</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Due Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Paid Via</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Reminders</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => {
                    const org = organisations.find(o => o.id === inv.orgId)
                    return (
                      <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono font-medium text-pluto-700">{inv.id}</td>
                        <td className="px-4 py-3 text-gray-900">{org?.name || '—'}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{inv.amount.toLocaleString()} CFA</td>
                        <td className="px-4 py-3 text-gray-500">{inv.dueDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[inv.status]}`}>{inv.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{inv.paidVia || '—'}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{inv.reminders.length} sent</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {inv.status !== 'paid' && (
                              <>
                                <button onClick={() => copyLink(inv)}
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-pluto-50 text-pluto-600 hover:bg-pluto-100 text-xs font-medium transition-colors">
                                  <Link2 size={11} />
                                  {copied === inv.id ? 'Copied!' : 'Link'}
                                </button>
                                <button onClick={() => setReminderModal(inv)}
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-medium transition-colors">
                                  <Bell size={11} /> Chase
                                </button>
                                <button onClick={() => markPaid(inv.id)}
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium transition-colors">
                                  <CheckCircle size={11} /> Paid
                                </button>
                              </>
                            )}
                            {inv.status === 'paid' && inv.paymentRef && (
                              <span className="text-xs text-gray-400 font-mono">{inv.paymentRef}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Templates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Invoice Templates</h3>
              <div className="grid grid-cols-3 gap-3">
                {invoiceTemplates.map(tp => (
                  <div key={tp.id} className="p-3 rounded-lg border border-pluto-100 bg-pluto-50 hover:border-pluto-300 transition-colors cursor-pointer">
                    <p className="font-medium text-pluto-800 text-sm">{tp.name}</p>
                    <p className="text-xs text-pluto-600 mt-0.5">{tp.description}</p>
                    <button className="mt-2 text-xs text-pluto-700 font-medium hover:underline">Use →</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RECONCILIATION TAB */}
        {tab === 'reconciliation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Landmark size={16} className="text-pluto-600" />
                  Connected Accounts
                </h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                  <CreditCard size={13} /> Connect Account
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {connectedBankAccounts.map(acc => (
                  <div key={acc.id} className={`p-4 rounded-lg border-2 ${acc.status === 'connected' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900">{acc.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${acc.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {acc.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{acc.type} · {acc.accountNo}</p>
                    {acc.balance !== null && (
                      <p className="text-sm font-semibold text-gray-900 mt-1">{acc.balance.toLocaleString()} CFA</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <RefreshCw size={16} className="text-pluto-600" />
                  Unmatched Transactions
                </h2>
                <span className="text-xs text-gray-400 bg-red-50 text-red-600 px-2 py-1 rounded-full">{txns.filter(t => !t.matched).length} pending</span>
              </div>
              <div className="space-y-3">
                {txns.filter(tx => !tx.matched).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-400">{tx.id}</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{tx.source}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{tx.reference}</p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900">{tx.amount.toLocaleString()} CFA</p>
                      {tx.suggestedInvoice && (
                        <div className="flex items-center gap-1.5 mt-2 justify-end">
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Looks like {tx.suggestedInvoice}
                          </span>
                          <button onClick={() => matchTxn(tx.id, tx.suggestedInvoice!)}
                            className="px-2 py-0.5 bg-pluto-600 text-white text-xs rounded font-medium hover:bg-pluto-700 transition-colors">
                            Match
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {txns.filter(t => !t.matched).length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-6">All transactions reconciled ✓</p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">Phase 2: Live bank feeds via MTN MoMo API & Orange Money API will auto-populate transactions in real time.</p>
          </div>
        )}

        {/* FORECASTING TAB */}
        {tab === 'forecasting' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {forecastData.map(f => (
                <div key={f.label} className={`bg-white rounded-xl p-5 shadow-sm border ${f.type === 'projected' ? 'border-pluto-200 bg-pluto-50' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    {f.type === 'in' ? <TrendingUp size={14} className="text-green-500" /> :
                     f.type === 'out' ? <TrendingDown size={14} className="text-red-500" /> :
                     <Calendar size={14} className="text-pluto-500" />}
                    <p className="text-xs text-gray-400">{f.label}</p>
                  </div>
                  <p className={`text-xl font-bold ${
                    f.type === 'in' ? 'text-green-600' :
                    f.type === 'out' ? 'text-red-500' :
                    f.type === 'projected' ? 'text-pluto-700' : 'text-gray-900'
                  }`}>
                    {f.value < 0 ? '-' : ''}{Math.abs(f.value).toLocaleString()} CFA
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">30-Day Cash Flow Projection</h3>
              <div className="space-y-3">
                {[
                  { label: 'MTN MoMo Business balance', value: 2340000, type: 'balance' },
                  { label: 'Orange Money Pro balance', value: 890000, type: 'balance' },
                  { label: 'INV-001 expected (due 15 Jul, Net 30)', value: 125000, type: 'in' },
                  { label: 'INV-004 expected (due 20 Jul, Net 14)', value: 78000, type: 'in' },
                  { label: 'INV-002 overdue — payment at risk', value: -450000, type: 'risk' },
                  { label: 'Staff salaries (est. end of month)', value: -280000, type: 'out' },
                  { label: 'Supplier orders (inventory restock)', value: -120000, type: 'out' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <span className={`text-sm font-semibold ${
                      item.type === 'in' ? 'text-green-600' :
                      item.type === 'out' ? 'text-red-500' :
                      item.type === 'risk' ? 'text-amber-600' : 'text-gray-900'
                    }`}>
                      {item.value > 0 ? '+' : ''}{item.value.toLocaleString()} CFA
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2 font-bold">
                  <span className="text-gray-900">Projected 30-day balance</span>
                  <span className="text-pluto-700 text-lg">3,383,000 CFA</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">Forecast based on payment terms, invoice due dates, and expected outgoings. Phase 2: live bank feeds will update this automatically.</p>
            </div>
          </div>
        )}
      </main>

      {/* Raise Invoice Modal */}
      {newInvoiceModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Raise New Invoice</h3>
              <button onClick={() => setNewInvoiceModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Organisation</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                  {organisations.map(o => <option key={o.id}>{o.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Template</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                  {invoiceTemplates.map(t => <option key={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Issue Date</label>
                  <input type="date" defaultValue="2026-07-09" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
                  <input type="date" defaultValue="2026-07-30" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <textarea rows={2} placeholder="What is this invoice for?" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Amount (CFA)</label>
                <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setNewInvoiceModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setNewInvoiceModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Save Draft</button>
              <button onClick={() => setNewInvoiceModal(false)} className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Send Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder modal */}
      {reminderModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Credit Control — {reminderModal.id}</h3>
              <button onClick={() => setReminderModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-2">Organisation: <strong>{organisations.find(o=>o.id===reminderModal.orgId)?.name}</strong></p>
            <p className="text-sm text-gray-500 mb-4">Amount: <strong>{reminderModal.amount.toLocaleString()} CFA</strong> · Due: {reminderModal.dueDate}</p>
            <div className="space-y-1.5 mb-4">
              {[
                '3 days before due date',
                'On due date',
                '7 days overdue — chase invoice',
                '14 days overdue — escalate',
                '30 days overdue — formal notice',
              ].map((r, i) => (
                <label key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked={i < 3} className="accent-pluto-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">{r}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 p-2.5 rounded-lg mb-4">
              <Link2 size={11} />
              Payment link auto-included in every chase: <span className="font-mono ml-1 truncate text-pluto-600">{reminderModal.paymentLink}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setReminderModal(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              <button onClick={() => setReminderModal(null)} className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Save & Schedule</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
