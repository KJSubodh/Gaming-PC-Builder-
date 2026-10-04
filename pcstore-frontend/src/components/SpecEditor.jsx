import React from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

// Suggested labels only (admin UX). The admin types every VALUE; nothing is hardcoded on the shop side.
const SUGGESTIONS = {
  CPU: ['Generation', 'Socket Type', 'Base Clock', 'Max Boost Clock', 'Cores / Threads', 'TDP', 'Compatibility'],
  RAM: ['Generation', 'Speed', 'Voltage', 'CAS Latency', 'Capacity', 'Compatibility'],
  MOTHERBOARD: ['Chipset', 'Socket Type', 'RAM Generation', 'Max RAM Speed', 'Form Factor', 'Compatibility'],
  GPU: ['Architecture', 'Base Clock', 'Boost Clock', 'Memory Type', 'Power Connectors', 'Compatibility'],
  PSU: ['Rated Power', 'Efficiency', 'Voltage Input', 'Connectors', 'Compatibility'],
}
const GROUPS = ['Overview', 'Performance', 'Memory', 'Power', 'Compatibility']

// specifications JSON -> editable rows
export const specsToRows = (specs) => {
  if (!specs || typeof specs !== 'object') return []
  if (Array.isArray(specs.groups)) {
    return specs.groups.flatMap((g) =>
      (g.items || []).map((i) => ({ group: g.title || '', label: i.label || '', value: i.value || '' })))
  }
  return Object.entries(specs).map(([label, value]) => ({ group: '', label, value: String(value) }))
}

// rows -> ordered JSON (arrays keep order; Postgres jsonb would reorder plain object keys)
export const rowsToSpecs = (rows) => {
  const clean = rows.filter((r) => r.label.trim() && r.value.trim())
  const order = []
  const byGroup = {}
  clean.forEach((r) => {
    const title = r.group.trim() || 'Overview'
    if (!byGroup[title]) { byGroup[title] = []; order.push(title) }
    byGroup[title].push({ label: r.label.trim(), value: r.value.trim() })
  })
  return order.length ? { groups: order.map((title) => ({ title, items: byGroup[title] })) } : {}
}

const input = 'w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500'

const SpecEditor = ({ category, rows, onChange }) => {
  const suggestions = SUGGESTIONS[category] || []
  const update = (i, field, v) => onChange(rows.map((r, idx) => (idx === i ? { ...r, [field]: v } : r)))
  const add = (label = '') => onChange([...rows, { group: rows[rows.length - 1]?.group || '', label, value: '' }])

  return (
    <div className="mt-8 pt-6 border-t border-neutral-100">
      <h3 className="text-base font-semibold text-neutral-900">Product Overview Specs</h3>
      <p className="text-xs text-neutral-500 mb-4">Shown on the product overview page. Add any label and value, e.g. Generation, Voltage, Socket Type.</p>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.filter((s) => !rows.some((r) => r.label === s)).map((s) => (
            <button type="button" key={s} onClick={() => add(s)}
              className="px-2.5 py-1 text-xs rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-50">
              + {s}
            </button>
          ))}
        </div>
      )}

      <datalist id="spec-groups">{GROUPS.map((g) => <option key={g} value={g} />)}</datalist>

      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input list="spec-groups" className={`${input} col-span-3`} placeholder="Group" value={r.group} onChange={(e) => update(i, 'group', e.target.value)} />
            <input className={`${input} col-span-4`} placeholder="Label (e.g. Voltage)" value={r.label} onChange={(e) => update(i, 'label', e.target.value)} />
            <input className={`${input} col-span-4`} placeholder="Value (e.g. 1.25 V)" value={r.value} onChange={(e) => update(i, 'value', e.target.value)} />
            <button type="button" onClick={() => onChange(rows.filter((_, idx) => idx !== i))} className="col-span-1 text-red-500 hover:text-red-700 flex justify-center">
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => add()} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900">
        <FiPlus size={14} /> Add spec
      </button>
    </div>
  )
}

export default SpecEditor