import { useEffect, useState } from 'react'
import { X, Keyboard } from 'lucide-react'

const shortcuts = [
  { keys: ['⌘', 'K'], label: 'Open global search' },
  { keys: ['N'], label: 'New item (context-sensitive)' },
  { keys: ['Esc'], label: 'Close modal / panel' },
  { keys: ['?'], label: 'Show keyboard shortcuts' },
  { keys: ['G', 'D'], label: 'Go to Dashboard' },
  { keys: ['G', 'O'], label: 'Go to Organisations' },
  { keys: ['G', 'C'], label: 'Go to Contacts' },
  { keys: ['G', 'P'], label: 'Go to Pipeline' },
  { keys: ['G', 'I'], label: 'Go to Inventory' },
]

interface Props {
  onClose: () => void
}

export default function KeyboardShortcutsModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Keyboard size={16} className="text-pluto-600" /> Keyboard Shortcuts
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{s.label}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-mono font-semibold border border-gray-200">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">Press <span className="font-mono bg-gray-100 px-1 rounded">?</span> anytime to show this</p>
      </div>
    </div>
  )
}

export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      // Don't trigger in input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return
      const key = e.key
      if ((e.metaKey || e.ctrlKey) && key === 'k') { e.preventDefault(); handlers['cmd+k']?.() }
      else if (key === '?') handlers['?']?.()
      else if (key === 'Escape') handlers['esc']?.()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [handlers])
}
