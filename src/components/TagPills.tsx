import { X, Plus } from 'lucide-react'
import { useState } from 'react'

const TAG_COLORS = [
  'bg-pluto-100 text-pluto-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-red-100 text-red-700',
  'bg-teal-100 text-teal-700',
]

function tagColor(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}

interface Props {
  tags: string[]
  editable?: boolean
  onChange?: (tags: string[]) => void
  size?: 'sm' | 'xs'
}

export default function TagPills({ tags, editable = false, onChange, size = 'sm' }: Props) {
  const [adding, setAdding] = useState(false)
  const [newTag, setNewTag] = useState('')
  const px = size === 'xs' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs'

  const remove = (tag: string) => onChange?.(tags.filter(t => t !== tag))
  const add = () => {
    const trimmed = newTag.trim()
    if (trimmed && !tags.includes(trimmed)) onChange?.([...tags, trimmed])
    setNewTag('')
    setAdding(false)
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {tags.map(tag => (
        <span key={tag} className={`inline-flex items-center gap-0.5 rounded-full font-medium ${px} ${tagColor(tag)}`}>
          {tag}
          {editable && (
            <button onClick={() => remove(tag)} className="ml-0.5 opacity-60 hover:opacity-100">
              <X size={10} />
            </button>
          )}
        </span>
      ))}
      {editable && !adding && (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs text-gray-400 border border-dashed border-gray-300 hover:border-pluto-400 hover:text-pluto-600 transition-colors">
          <Plus size={10} /> tag
        </button>
      )}
      {editable && adding && (
        <input
          autoFocus
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') add(); if (e.key === 'Escape') { setAdding(false); setNewTag('') } }}
          onBlur={add}
          placeholder="New tag…"
          className="px-2 py-0.5 rounded-full text-xs border border-pluto-300 focus:outline-none focus:ring-1 focus:ring-pluto-400 w-20"
        />
      )}
    </div>
  )
}
