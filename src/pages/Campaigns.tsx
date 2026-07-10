import { useState } from 'react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { campaigns, campaignTemplates } from '../data/mockData'
import { Upload, X } from 'lucide-react'

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Completed: 'bg-gray-100 text-gray-600',
  Draft: 'bg-amber-100 text-amber-700',
}

export default function Campaigns() {
  const { t } = useLang()
  const [showImport, setShowImport] = useState(false)

  return (
    <>
      <TopBar title={t('campaigns')} />
      <main className="p-6 space-y-6">
        {/* Campaigns list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">All Campaigns</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowImport(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-pluto-200 text-pluto-600 rounded-lg text-sm font-medium hover:bg-pluto-50 transition-colors">
                <Upload size={13} />{t('import list')}
              </button>
              <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ New Campaign</button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Campaign</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Sent</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Opened</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Clicks</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
            </tr></thead>
            <tbody>{campaigns.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.type}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span></td>
                <td className="px-4 py-3 text-gray-500">{c.sent}</td>
                <td className="px-4 py-3 text-gray-500">{c.opened || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{c.clicks || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{c.date}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* Templates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{t('templates')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {campaignTemplates.map(tp => (
              <div key={tp.id} className="p-4 rounded-lg border border-pluto-100 bg-pluto-50 hover:border-pluto-300 transition-colors cursor-pointer">
                <p className="font-medium text-pluto-800 text-sm mb-1">{tp.name}</p>
                <p className="text-xs text-pluto-600 mb-2">{tp.subject}</p>
                <p className="text-xs text-gray-400 truncate">{tp.preview}</p>
                <button className="mt-3 text-xs text-pluto-700 font-medium hover:underline">Use template →</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CSV Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Import Contact List (CSV)</h3>
              <button onClick={() => setShowImport(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="border-2 border-dashed border-pluto-200 rounded-xl p-8 text-center mb-4 bg-pluto-50 hover:bg-pluto-100 transition-colors cursor-pointer">
              <Upload size={24} className="text-pluto-400 mx-auto mb-2" />
              <p className="text-sm text-pluto-700 font-medium">Drop CSV file here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">Supports .csv files up to 10MB</p>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Column Mapping</p>
              {['Name', 'Phone', 'Email', 'Organisation', 'City'].map(col => (
                <div key={col} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-24">{col}</span>
                  <select className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-500">
                    <option>Select column…</option>
                    <option>Column A</option>
                    <option>Column B</option>
                    <option>Column C</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowImport(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">{t('cancel')}</button>
              <button onClick={() => setShowImport(false)} className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">Import</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
