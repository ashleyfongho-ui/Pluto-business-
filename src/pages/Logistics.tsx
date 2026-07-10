import { useState } from 'react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { deliveries } from '../data/mockData'
import { Package, Truck, ShoppingBag, CheckCircle, Phone, MapPin, X, Navigation, Building2, Plus } from 'lucide-react'

const statusColors: Record<string, string> = {
  Preparing: 'bg-gray-100 text-gray-600',
  'In Transit': 'bg-amber-100 text-amber-700',
  'At Market': 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
}

const statusProgress: Record<string, number> = {
  Preparing: 1,
  'In Transit': 2,
  'At Market': 3,
  Delivered: 4,
}

type Delivery = typeof deliveries[0]

export default function Logistics() {
  const { t } = useLang()
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [showRoute, setShowRoute] = useState<Delivery | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const summary = [
    { label: t('deliveries today'), value: deliveries.length, icon: Truck, color: 'text-pluto-600 bg-pluto-50' },
    { label: t('goods at market'), value: deliveries.filter(d => d.status === 'At Market').length, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Delivered', value: deliveries.filter(d => d.status === 'Delivered').length, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: t('in transit'), value: deliveries.filter(d => d.status === 'In Transit').length, icon: Truck, color: 'text-amber-600 bg-amber-50' },
  ]

  const totalValue = deliveries.reduce((s, d) => s + d.value, 0)
  const paidValue = deliveries.filter(d => d.paymentReceived).reduce((s, d) => s + d.value, 0)

  const filtered = filterStatus === 'all' ? deliveries : deliveries.filter(d => d.status === filterStatus)

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
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-gray-900">Deliveries</h2>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                {['all', 'Preparing', 'In Transit', 'At Market', 'Delivered'].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${filterStatus === s ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
                    {s === 'all' ? 'All' : s}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowNew(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
              <Plus size={13} /> New Delivery
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Goods</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Route</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Driver</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Value</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">ETA</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Payment</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedDelivery(d)}>
                  <td className="px-4 py-3 font-mono text-xs text-pluto-600">{d.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{d.product}</p>
                    <p className="text-xs text-gray-400">Qty: {d.quantity}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-500">{d.origin}</p>
                    <p className="text-xs text-gray-700 flex items-center gap-1 mt-0.5">
                      <Navigation size={9} className="text-pluto-500" />{d.destination}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900 font-medium">{d.driver}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Building2 size={9} />{d.driverOrg}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{d.value.toLocaleString()} CFA</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{d.expectedArrival}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[d.status]}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {d.paymentReceived
                      ? <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle size={12} />Paid</span>
                      : <span className="text-amber-600 text-xs font-medium">Pending</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); setShowRoute(d) }}
                      className="flex items-center gap-1 px-2 py-1 bg-pluto-50 text-pluto-600 rounded text-xs font-medium hover:bg-pluto-100 transition-colors">
                      <MapPin size={10} /> Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment reconciliation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Reconciliation</h2>
          <div className="flex gap-8 mb-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalValue.toLocaleString()} CFA</p>
              <p className="text-xs text-gray-400">Total dispatched</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{paidValue.toLocaleString()} CFA</p>
              <p className="text-xs text-gray-400">Payments received</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{(totalValue - paidValue).toLocaleString()} CFA</p>
              <p className="text-xs text-gray-400">Outstanding</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${totalValue > 0 ? (paidValue / totalValue) * 100 : 0}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{totalValue > 0 ? Math.round((paidValue / totalValue) * 100) : 0}% collected</p>
        </div>
      </main>

      {/* Delivery detail slide-over */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setSelectedDelivery(null)} />
          <div className="w-96 bg-white h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{selectedDelivery.id}</h2>
              <button onClick={() => setSelectedDelivery(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* Status progress */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Progress</p>
                <div className="flex items-center gap-1">
                  {['Preparing', 'In Transit', 'At Market', 'Delivered'].map((s, i) => {
                    const current = statusProgress[selectedDelivery.status]
                    const step = i + 1
                    return (
                      <div key={s} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          step <= current ? 'bg-pluto-600 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>{step}</div>
                        {i < 3 && <div className={`h-0.5 w-full ${step < current ? 'bg-pluto-600' : 'bg-gray-100'}`} />}
                        <span className="text-xs text-gray-500 text-center leading-tight">{s}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Goods */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Goods</p>
                <p className="font-semibold text-gray-900">{selectedDelivery.product}</p>
                <p className="text-sm text-gray-500">Qty: {selectedDelivery.quantity} · Value: {selectedDelivery.value.toLocaleString()} CFA</p>
              </div>

              {/* Route */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Route</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Origin</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDelivery.origin}</p>
                      <p className="text-xs text-gray-400">Dispatched: {selectedDelivery.dispatchTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-pluto-50 rounded-lg border border-pluto-100">
                    <div className="w-2 h-2 rounded-full bg-pluto-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Destination</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDelivery.destination}</p>
                      <p className="text-xs text-gray-400">ETA: {selectedDelivery.expectedArrival}</p>
                    </div>
                  </div>
                </div>
                <button className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 border border-pluto-200 text-pluto-600 rounded-lg text-xs font-medium hover:bg-pluto-50 transition-colors">
                  <Navigation size={11} /> Open in Maps
                </button>
              </div>

              {/* Driver */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Driver</p>
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center font-bold text-sm">
                      {selectedDelivery.driver.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedDelivery.driver}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Building2 size={10} />{selectedDelivery.driverOrg}</p>
                    </div>
                  </div>
                  <a href={`tel:${selectedDelivery.driverPhone}`}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium text-sm hover:bg-green-100 transition-colors w-full justify-center">
                    <Phone size={14} /> {selectedDelivery.driverPhone}
                  </a>
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Payment</p>
                <div className={`p-3 rounded-xl ${selectedDelivery.paymentReceived ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}>
                  <p className={`text-sm font-semibold ${selectedDelivery.paymentReceived ? 'text-green-700' : 'text-amber-700'}`}>
                    {selectedDelivery.paymentReceived ? '✓ Payment received' : 'Payment pending'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedDelivery.value.toLocaleString()} CFA</p>
                  {!selectedDelivery.paymentReceived && (
                    <button className="mt-2 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors">
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>

              {/* Update status */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Update Status</p>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 mb-2">
                  {['Preparing', 'In Transit', 'At Market', 'Delivered'].map(s => (
                    <option key={s} selected={s === selectedDelivery.status}>{s}</option>
                  ))}
                </select>
                <button className="w-full py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">Save Update</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Route map modal */}
      {showRoute && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Navigation size={16} className="text-pluto-600" /> Route View — {showRoute.id}
              </h3>
              <button onClick={() => setShowRoute(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {/* Simplified route visualisation */}
            <div className="bg-gray-50 rounded-xl p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
                  <div className="w-0.5 h-16 bg-gray-300 my-1 border-dashed" style={{ borderLeft: '2px dashed #9ca3af', background: 'transparent' }} />
                  <div className="w-4 h-4 rounded-full bg-pluto-600 border-2 border-white shadow" />
                </div>
                <div className="flex-1 flex flex-col justify-between h-24">
                  <div className="bg-white rounded-lg p-2.5 border border-green-100">
                    <p className="text-xs text-gray-400">FROM</p>
                    <p className="font-medium text-gray-900 text-sm">{showRoute.origin}</p>
                    <p className="text-xs text-gray-400">Departed {showRoute.dispatchTime}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-pluto-100">
                    <p className="text-xs text-gray-400">TO</p>
                    <p className="font-medium text-gray-900 text-sm">{showRoute.destination}</p>
                    <p className="text-xs text-gray-400">ETA {showRoute.expectedArrival}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-lg p-2 border border-gray-100">
                  <p className="text-xs text-gray-400">Driver</p>
                  <p className="text-sm font-medium text-gray-900">{showRoute.driver}</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-gray-100">
                  <p className="text-xs text-gray-400">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[showRoute.status]}`}>{showRoute.status}</span>
                </div>
                <div className="bg-white rounded-lg p-2 border border-gray-100">
                  <p className="text-xs text-gray-400">Value</p>
                  <p className="text-sm font-semibold text-gray-900">{(showRoute.value / 1000).toFixed(0)}K CFA</p>
                </div>
              </div>
            </div>

            <div className="bg-pluto-50 rounded-lg p-3 text-center border border-pluto-100">
              <p className="text-xs text-pluto-600 font-medium">Phase 2: Live GPS tracking via driver app</p>
              <p className="text-xs text-gray-400 mt-0.5">Real-time map view will appear here when driver has the Pluto mobile app installed</p>
            </div>

            <a href={`https://www.google.com/maps/dir/${encodeURIComponent(showRoute.origin)}/${encodeURIComponent(showRoute.destination)}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-pluto-600 text-white rounded-xl text-sm font-medium hover:bg-pluto-700 transition-colors">
              <Navigation size={14} /> Open Route in Google Maps
            </a>
          </div>
        </div>
      )}

      {/* New Delivery modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">New Delivery</h3>
              <button onClick={() => setShowNew(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Goods / Product</label>
                <input placeholder="e.g. Paracetamol 500mg × 200 units" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Origin</label>
                  <input placeholder="Warehouse / depot" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Destination</label>
                  <input placeholder="Client / market" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Driver Name</label>
                  <input placeholder="Driver full name" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Driver Organisation</label>
                  <input placeholder="In-house / company name" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Driver Phone</label>
                  <input placeholder="+237 …" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Goods Value (CFA)</label>
                  <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Dispatch Time</label>
                  <input type="time" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Expected Arrival</label>
                  <input type="time" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowNew(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowNew(false)} className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Create Delivery</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
