'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORY_META } from '@/lib/wiki'

interface SearchResult {
  title: string
  slug: string
  category: string
  tags?: string[]
}

export function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
        setResults([])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await r.json()
        setResults(data.slice(0, 10))
        setSelected(0)
      } catch { setResults([]) }
      setLoading(false)
    }, 200)
    return () => clearTimeout(t)
  }, [query])

  const navigate = useCallback((result: SearchResult) => {
    router.push(`/${result.category}/${result.slug}`)
    setOpen(false)
    setQuery('')
    setResults([])
  }, [router])

  // Keyboard nav
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[selected]) navigate(results[selected])
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] search-backdrop"
      onClick={() => { setOpen(false); setQuery(''); setResults([]) }}
    >
      <div
        className="w-full max-w-lg rounded-xl overflow-hidden animate-scale-in"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search wiki..."
            className="flex-1 py-3.5 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text)' }}
          />
          <kbd
            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Searching...
            </div>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
              No results for "{query}"
            </div>
          )}
          {results.map((r, i) => {
            const meta = CATEGORY_META[r.category]
            return (
              <button
                key={`${r.category}-${r.slug}`}
                onClick={() => navigate(r)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{
                  background: i === selected ? 'var(--accent-muted)' : 'transparent',
                  borderBottom: '1px solid var(--border)',
                }}
                onMouseEnter={() => setSelected(i)}
              >
                <span className="text-xs opacity-50 w-4 text-center">{meta?.icon ?? '•'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{r.title}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{meta?.label ?? r.category}</div>
                </div>
                {i === selected && (
                  <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>↵</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Footer hint */}
        {query.length < 2 && (
          <div className="px-4 py-3 text-[11px] flex items-center gap-4" style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border)' }}>
            <span>Type to search across all wiki articles</span>
          </div>
        )}
      </div>
    </div>
  )
}
