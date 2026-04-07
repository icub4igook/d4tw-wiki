import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticle, getAllArticles, getBacklinkArticles, CATEGORY_META } from '@/lib/wiki'
import { MarkdownContent } from '@/components/MarkdownContent'
import { TableOfContents } from '@/components/TableOfContents'

export const revalidate = 60

export default async function ArticlePage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params
  const meta = CATEGORY_META[category]
  if (!meta) notFound()

  const article = await getArticle(category, slug)
  if (!article) notFound()

  const allArticles = await getAllArticles()
  const backlinks = getBacklinkArticles(slug, allArticles)

  return (
    <div className="flex">
      {/* Main content */}
      <div className="flex-1 max-w-3xl px-8 py-10" style={{ marginRight: 'var(--toc-width)' }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] mb-6" style={{ color: 'var(--text-tertiary)' }}>
          <Link href="/" className="no-underline hover:underline" style={{ color: 'var(--text-tertiary)' }}>Wiki</Link>
          <span>/</span>
          <Link href={`/${category}`} className="no-underline hover:underline" style={{ color: 'var(--text-tertiary)' }}>{meta.label}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }} className="truncate max-w-[200px]">{article.title}</span>
        </div>

        {/* Title + meta */}
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text)' }}>
          {article.title}
        </h1>
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {article.tags?.map(tag => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded"
              style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)', border: '1px solid var(--tag-border)' }}
            >
              {tag}
            </span>
          ))}
          {article.confidence && (
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded"
              style={{
                color: article.confidence === 'high' ? 'var(--confidence-high)' : article.confidence === 'medium' ? 'var(--confidence-medium)' : 'var(--confidence-low)',
                background: article.confidence === 'high' ? '#f0fdf4' : article.confidence === 'medium' ? '#fefce8' : '#fef2f2',
              }}
            >
              {article.confidence} confidence
            </span>
          )}
        </div>

        {/* Article content */}
        <MarkdownContent content={article.content ?? ''} />

        {/* Backlinks */}
        {backlinks.length > 0 && (
          <div className="mt-12 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Linked from
            </h3>
            <div className="space-y-1">
              {backlinks.map(bl => (
                <Link
                  key={bl.id}
                  href={`/${bl.category}/${bl.slug}`}
                  className="flex items-center gap-2 text-sm py-1 no-underline"
                  style={{ color: 'var(--accent)' }}
                >
                  <span className="text-xs opacity-40">{CATEGORY_META[bl.category]?.icon ?? '•'}</span>
                  {bl.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Metadata footer */}
        <div className="mt-10 pt-4 flex items-center gap-4 text-[11px]" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>
          <span>Created {new Date(article.created_at).toLocaleDateString('en-CA')}</span>
          <span>·</span>
          <span>Updated {new Date(article.updated_at).toLocaleDateString('en-CA')}</span>
          {article.status && (
            <>
              <span>·</span>
              <span className="capitalize">{article.status}</span>
            </>
          )}
        </div>
      </div>

      {/* TOC */}
      <TableOfContents content={article.content ?? ''} />
    </div>
  )
}
