'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORY_META } from '@/lib/wiki'

interface SidebarCategory {
  category: string
  count: number
  articles: { title: string; slug: string; category: string }[]
}

export function Sidebar() {
  const pathname = usePathname()
  const [categories, setCategories] = useState<SidebarCategory[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/sidebar')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  // Auto-expand current category
  useEffect(() => {
    const seg = pathname.split('/').filter(Boolean)[0]
    if (seg) setExpanded(prev => ({ ...prev, [seg]: true }))
  }, [pathname])

  const toggle = (cat: string) => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }))

  return (
    <aside
      className="fixed top-0 left-0 h-screen overflow-y-auto border-r flex flex-col z-30"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 shrink-0"
        style={{ height: 'var(--header-height)', borderBottom: '1px solid var(--border)' }}
      >
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span
            className="text-xs font-bold tracking-widest px-2 py-0.5 rounded"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            D4TW
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Brand Wiki
          </span>
        </Link>
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {categories.map(cat => {
          const meta = CATEGORY_META[cat.category] ?? { label: cat.category, icon: '•' }
          const isExpanded = expanded[cat.category]
          const isCategoryActive = pathname.startsWith(`/${cat.category}`)

          return (
            <div key={cat.category} className="mb-0.5">
              <button
                onClick={() => toggle(cat.category)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-[13px] font-medium transition-colors"
                style={{
                  color: isCategoryActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isCategoryActive ? 'var(--accent-muted)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isCategoryActive) (e.target as HTMLElement).style.background = 'var(--bg-tertiary)'
                }}
                onMouseLeave={e => {
                  if (!isCategoryActive) (e.target as HTMLElement).style.background = 'transparent'
                }}
              >
                <span className="text-xs opacity-60 w-4 text-center">{meta.icon}</span>
                <span className="flex-1">{meta.label}</span>
                <span
                  className="text-[11px] tabular-nums"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {cat.count}
                </span>
                <svg
                  className="w-3.5 h-3.5 transition-transform"
                  style={{
                    color: 'var(--text-tertiary)',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="ml-4 mt-0.5 border-l pl-2" style={{ borderColor: 'var(--border)' }}>
                  {cat.articles.map(article => {
                    const isActive = pathname === `/${article.category}/${article.slug}`
                    return (
                      <Link
                        key={article.slug}
                        href={`/${article.category}/${article.slug}`}
                        className="block px-2 py-1 rounded text-[13px] no-underline transition-colors truncate"
                        style={{
                          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                          background: isActive ? 'var(--accent-muted)' : 'transparent',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) (e.target as HTMLElement).style.background = 'var(--bg-tertiary)'
                        }}
                        onMouseLeave={e => {
                          if (!isActive) (e.target as HTMLElement).style.background = 'transparent'
                        }}
                      >
                        {article.title}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3 text-[11px] shrink-0"
        style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border)' }}
      >
        D4TW Brand Wiki · Internal
      </div>
    </aside>
  )
}
