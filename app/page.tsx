import Link from 'next/link'
import { getWikiHealth, getRecentArticles, getAllCategories, CATEGORY_META } from '@/lib/wiki'

export const revalidate = 60

export default async function HomePage() {
  const [health, recent, categories] = await Promise.all([
    getWikiHealth(),
    getRecentArticles(8),
    getAllCategories(),
  ])

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
          Brand Wiki
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          D4TW internal knowledge base — strategy, brand, operations, and market intelligence.
        </p>
      </div>

      {/* Health stats */}
      {health && (
        <div
          className="grid grid-cols-3 gap-px rounded-lg overflow-hidden mb-10"
          style={{ background: 'var(--border)' }}
        >
          {[
            { label: 'Articles', value: health.total_articles },
            { label: 'Categories', value: health.categories },
            { label: 'Last updated', value: new Date(health.last_updated).toLocaleDateString('en-CA') },
          ].map(stat => (
            <div key={stat.label} className="px-5 py-4" style={{ background: 'var(--bg-secondary)' }}>
              <div className="text-xl font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
                {stat.value}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category grid */}
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
        Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-10">
        {categories.map(cat => {
          const meta = CATEGORY_META[cat.category] ?? { label: cat.category, icon: '•', description: '' }
          return (
            <Link
              key={cat.category}
              href={`/${cat.category}`}
              className="group px-4 py-3 rounded-lg no-underline transition-all"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs opacity-50">{meta.icon}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{meta.label}</span>
                <span className="text-[11px] ml-auto tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
                  {cat.count}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                {meta.description}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Recently updated */}
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
        Recently Updated
      </h2>
      <div className="space-y-px rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {recent.map(article => {
          const meta = CATEGORY_META[article.category]
          return (
            <Link
              key={article.id}
              href={`/${article.category}/${article.slug}`}
              className="flex items-center gap-3 px-4 py-2.5 no-underline transition-colors hover:!bg-[var(--bg-tertiary)]"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <span className="text-xs opacity-40 w-4 text-center">{meta?.icon ?? '•'}</span>
              <span className="text-sm flex-1 truncate" style={{ color: 'var(--text)' }}>{article.title}</span>
              <span className="text-[11px] tabular-nums shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                {new Date(article.updated_at).toLocaleDateString('en-CA')}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
