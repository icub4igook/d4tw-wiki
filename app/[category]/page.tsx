import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticlesByCategory, CATEGORY_META } from '@/lib/wiki'

export const revalidate = 60

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params
  const meta = CATEGORY_META[category]
  if (!meta) notFound()

  const articles = await getArticlesByCategory(category)

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] mb-6" style={{ color: 'var(--text-tertiary)' }}>
        <Link href="/" className="no-underline hover:underline" style={{ color: 'var(--text-tertiary)' }}>Wiki</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{meta.label}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-lg opacity-40">{meta.icon}</span>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{meta.label}</h1>
          <span className="text-[12px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
            {articles.length} articles
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{meta.description}</p>
      </div>

      {/* Articles */}
      <div className="space-y-px rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {articles.map(article => (
          <Link
            key={article.id}
            href={`/${category}/${article.slug}`}
            className="flex items-center gap-3 px-4 py-3 no-underline transition-colors hover:!bg-[var(--bg-tertiary)]"
            style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{article.title}</div>
              {article.tags?.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {article.tags.slice(0, 4).map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)', border: '1px solid var(--tag-border)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {article.confidence && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
                style={{
                  color: article.confidence === 'high' ? 'var(--confidence-high)' : article.confidence === 'medium' ? 'var(--confidence-medium)' : 'var(--confidence-low)',
                  background: article.confidence === 'high' ? '#f0fdf4' : article.confidence === 'medium' ? '#fefce8' : '#fef2f2',
                }}
              >
                {article.confidence}
              </span>
            )}
            <span className="text-[11px] tabular-nums shrink-0" style={{ color: 'var(--text-tertiary)' }}>
              {new Date(article.updated_at).toLocaleDateString('en-CA')}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
