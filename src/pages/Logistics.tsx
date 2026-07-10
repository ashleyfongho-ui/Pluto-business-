// logistics_enabled: true — can be toggled per-customer in settings
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { deliveries } from '../data/mockData'
import { Package, Truck, ShoppingBag, CheckCircle } from 'lucide-react'

const statusColors: Record<string, string> = {
  Preparing: 'bg-gray-100 text-gray-600',
  'In Transit': 'bg-amber-100 text-amber-700',
  'At Market': 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
}

export default function Logistics() {
  const { t } = useLang()

  const summary = [
    { label: t('deliveries today'), value: deliveries.length, icon: Truck, color: 'text-pluto-600 bg-pluto-50' },
    { label: t('goods at market'), value: deliveries.filter(d=>d.status==='At Market').length, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: t('goods on sale'), value: deliveries.filter(d=>['At Market','Delivered'].includes(d.status)).length, icon: Package, color: 'text-green-600 bg-green-50' },
    { label: t('in transit'), value: deliveries.filter(d=>d.status==='In Transit').length, icon: Truck, color: 'text-amber-600 bg-amber-50' },
  ]

  const totalValue = deliveries.reduce((s,d)=>s+d.value,0)
  const paidValue = deliveries.filter(d=>d.paymentReceived).reduce((s,d)=>s+d.value,0)

  return (
    <>
      <TopBar title={t('logistics')} />
      <main className="p-6">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {summary.map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                <s.icon size={16} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Deliveries table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Today's Deliveries</h2>
            <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ New Delivery</button>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-500">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Product / Goods</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Origin → Destination</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Driver</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Value</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Dispatch</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">ETA</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Paid</th>
            </tr></thead>
            <tbody>{deliveries.map(d => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-pluto-600">{d.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{d.product}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{d.origin} → <span className="text-gray-700">{d.destination}</span></td>
                <td className="px-4 py-3 text-gray-500">{d.driver}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{d.value.toLocaleString()} CFA</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{d.dispatchTime}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{d.expectedArrival}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[d.status]}`}>{d.status}</span>
                </td>
                <td className="px-4 py-3">
                  {d.paymentReceived
                    ? <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle size={12}/>Paid</span>
                    : <span className="text-gray-400 text-xs">Pending</span>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* Payments reconciliation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Reconciliation</h2>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalValue.toLocaleString()} CFA</p>
              <p className="text-xs text-gray-400">Total goods value dispatched</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{paidValue.toLocaleString()} CFA</p>
              <p className="text-xs text-gray-400">Payments received</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{(totalValue-paidValue).toLocaleString()} CFA</p>
              <p className="text-xs text-gray-400">Outstanding</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
