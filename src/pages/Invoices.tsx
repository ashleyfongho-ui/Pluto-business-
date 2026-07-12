import { useState } from 'react'
import { Link2, Bell, CheckCircle, CreditCard, RefreshCw, X, Landmark } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { invoices as rawInvoices, bankTransactions as initialTxns, connectedBankAccounts, organisations } from '../data/mockData'

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
type Txn = typeof initialTxns[0]

const statusColor: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  sent: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-600',
}

export default function Invoices() {
  const { t } = useLang()
  const [invoices, setInvoices] = useState(initialInvoices)
  const [txns, setTxns] = useState(initialTxns)
  const [tab, setTab] = useState<'invoices' | 'reconciliation'>('invoices')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')
  const [reminderModal, setReminderModal] = useState<Invoice | null>(null)
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

  const tabs = [
    { key: 'invoices', label: t('invoices') },
    { key: 'reconciliation', label: t('bank reconciliation') },
  ] as const

  return (
    <>
      <TopBar title={t('invoices')} />
      <main className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {tabs.map(tab_ => (
            <button key={tab_.key} onClick={() => setTab(tab_.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tab === tab_.key ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab_.label}
            </button>
          ))}
        </div>

        {tab === 'invoices' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Status filter bar */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              {(['all', 'sent', 'overdue', 'paid', 'draft'] as const).map(s => {
                const count = s === 'all' ? invoices.length : invoices.filter(i => i.status === s).length
                const activeClasses = s === 'all'
                  ? 'bg-pluto-600 text-white'
                  : s === 'overdue' ? 'bg-red-500 text-white'
                  : s === 'paid' ? 'bg-green-500 text-white'
                  : s === 'sent' ? 'bg-blue-500 text-white'
                  : 'bg-gray-600 text-white'
                const inactiveClasses = s === 'all'
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : s === 'overdue' ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : s === 'paid' ? 'bg-green-50 text-green-600 hover:bg-green-100'
                  : s === 'sent' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                return (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${
                      statusFilter === s ? activeClasses : inactiveClasses
                    }`}>
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    <span className={`text-xs font-bold ${
                      statusFilter === s ? 'opacity-80' : 'opacity-60'
                    }`}>{count}</span>
                  </button>
                )
              })}
              <div className="ml-auto text-xs text-gray-400">
                {statusFilter === 'all' ? invoices.length : invoices.filter(i => i.status === statusFilter).length} invoice{(statusFilter === 'all' ? invoices.length : invoices.filter(i => i.status === statusFilter).length) !== 1 ? 's' : ''}
              </div>
            </div>
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
                {(statusFilter === 'all' ? invoices : invoices.filter(i => i.status === statusFilter)).map(inv => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium text-pluto-700">{inv.id}</td>
                    <td className="px-4 py-3 text-gray-900">{organisations.find(o => o.id === inv.orgId)?.name || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{inv.amount.toLocaleString()} CFA</td>
                    <td className="px-4 py-3 text-gray-500">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{inv.paidVia || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{inv.reminders.length} sent</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {inv.status !== 'paid' && (
                          <>
                            <button onClick={() => copyLink(inv)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-pluto-50 text-pluto-600 hover:bg-pluto-100 text-xs font-medium transition-colors"
                              title="Copy payment link">
                              <Link2 size={11} />
                              {copied === inv.id ? 'Copied!' : 'Link'}
                            </button>
                            <button onClick={() => setReminderModal(inv)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-medium transition-colors"
                              title="Set reminder">
                              <Bell size={11} />
                              Remind
                            </button>
                            <button onClick={() => markPaid(inv.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium transition-colors"
                              title="Mark as paid">
                              <CheckCircle size={11} />
                              Paid
                            </button>
                          </>
                        )}
                        {inv.status === 'paid' && inv.paymentRef && (
                          <span className="text-xs text-gray-400 font-mono">{inv.paymentRef}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'reconciliation' && (
          <div className="space-y-6">
            {/* Connected accounts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Landmark size={16} className="text-pluto-600" />
                  {t('connected accounts')}
                </h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                  <CreditCard size={13} />
                  {t('connect account')}
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

            {/* Unmatched transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <RefreshCw size={16} className="text-pluto-600" />
                  {t('unmatched transactions')}
                </h2>
                <span className="text-xs text-gray-400">{txns.filter(t => !t.matched).length} pending</span>
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
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Looks like {tx.suggestedInvoice}
                          </span>
                          <button
                            onClick={() => matchTxn(tx.id, tx.suggestedInvoice!)}
                            className="px-2 py-0.5 bg-pluto-600 text-white text-xs rounded font-medium hover:bg-pluto-700 transition-colors">
                            {t('match')}
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

            {/* Note about Phase 2 */}
            <p className="text-xs text-gray-400 text-center">
              Phase 2: Live bank feeds via MTN MoMo API & Orange Money API will auto-populate transactions in real time.
            </p>
          </div>
        )}
      </main>

      {/* Reminder modal */}
      {reminderModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Set Payment Reminders — {reminderModal.id}</h3>
              <button onClick={() => setReminderModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Reminders will be sent to <strong>{organisations.find(o => o.id === reminderModal.orgId)?.name || '—'}</strong> via WhatsApp/Email until the invoice is paid.
            </p>
            <div className="space-y-2 mb-4">
              {[
                { label: '3 days before due date', checked: true },
                { label: 'On due date', checked: true },
                { label: '7 days overdue', checked: true },
                { label: '14 days overdue', checked: false },
                { label: '30 days overdue', checked: false },
              ].map((r, i) => (
                <label key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked={r.checked} className="accent-pluto-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">{r.label}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 p-2 bg-blue-50 rounded-lg">
              <Link2 size={12} className="text-blue-500" />
              Payment link will be included in every reminder: <span className="font-mono text-blue-600 ml-1 truncate">{reminderModal.paymentLink}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setReminderModal(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                {t('cancel')}
              </button>
              <button onClick={() => setReminderModal(null)}
                className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                Save Reminders
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
