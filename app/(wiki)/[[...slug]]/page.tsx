import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
} from 'fumadocs-ui/layouts/docs/page';
import { getTableOfContents } from 'fumadocs-core/content/toc';
import { notFound } from 'next/navigation';
import {
  getArticleBySlug,
  getAllArticles,
  getWikiHealth,
  getRecentArticles,
} from '@/lib/wiki';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { WikiHome } from '@/components/WikiHome';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function WikiPage({ params }: PageProps) {
  const { slug } = await params;

  // ── Homepage (no slug) ───────────────────────────────────────────
  if (!slug || slug.length === 0) {
    const [health, recent, articles] = await Promise.all([
      getWikiHealth(),
      getRecentArticles(8),
      getAllArticles(),
    ]);

    // Count articles per category
    const categoryCounts: Record<string, number> = {};
    for (const a of articles) {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    }

    return <WikiHome health={health} recent={recent} categoryCounts={categoryCounts} />;
  }

  // ── Article page ─────────────────────────────────────────────────
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const toc = await getTableOfContents(article.content ?? '');

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{article.title}</DocsTitle>
      <DocsDescription>
        {article.tags?.length > 0 && (
          <span className="flex gap-1.5 flex-wrap mt-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md bg-fd-accent/10 text-fd-accent-foreground border border-fd-border"
              >
                {tag}
              </span>
            ))}
            {article.confidence && (
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                  article.confidence === 'high'
                    ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                    : article.confidence === 'medium'
                      ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                      : 'bg-red-500/10 text-red-700 dark:text-red-400'
                }`}
              >
                {article.confidence} confidence
              </span>
            )}
          </span>
        )}
      </DocsDescription>
      <DocsBody>
        <MarkdownRenderer content={article.content ?? ''} />
        <div className="mt-8 pt-4 border-t border-fd-border text-xs text-fd-muted-foreground flex gap-3">
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
      </DocsBody>
    </DocsPage>
  );
}
