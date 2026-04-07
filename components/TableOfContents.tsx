'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const headings = content.match(/^#{1,3}\s+.+$/gm) ?? []
    setItems(
      headings.map(h => {
        const level = h.match(/^#+/)![0].length
        const text = h.replace(/^#+\s+/, '')
        const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '')
        return { id, text, level }
      })
    )
  }, [content])

  // Intersection observer for active heading
  useEffect(() => {
    if (!items.length) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )
    items.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <div
      className="hidden xl:block fixed top-0 right-0 h-screen overflow-y-auto py-20 px-4"
      style={{ width: 'var(--toc-width)' }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
        On this page
      </p>
      <nav className="space-y-0.5">
        {items.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block text-[12.5px] py-0.5 no-underline transition-colors truncate"
            style={{
              paddingLeft: `${(item.level - 1) * 12}px`,
              color: activeId === item.id ? 'var(--accent)' : 'var(--text-tertiary)',
              borderLeft: activeId === item.id ? '2px solid var(--accent)' : '2px solid transparent',
            }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  )
}
