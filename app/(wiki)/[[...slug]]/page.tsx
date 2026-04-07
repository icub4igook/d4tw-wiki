import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
} from 'fumadocs-ui/layouts/docs/page';
import { getTableOfContents } from 'fumadocs-core/content/toc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getArticleBySlug,
  getAllArticles,
  getWikiHealth,
  getRecentArticles,
} from '@/lib/wiki';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { WikiHome } from '@/components/WikiHome';

export const revalidate = 60;

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  identity: { label: 'Identity', description: 'Brand positioning, voice, and values' },
  audience: { label: 'Audience', description: 'Target segments and personas' },
  offers: { label: 'Offers', description: 'Products, services, and pricing' },
  outbound: { label: 'Outbound', description: 'Sales, outreach, and partnerships' },
  strategy: { label: 'Strategy', description: 'Business strategy and planning' },
  design: { label: 'Design', description: 'Visual identity and design system' },
  platform: { label: 'Platform', description: 'Technical architecture and stack' },
  operations: { label: 'Operations', description: 'Workflows, SOPs, and processes' },
  market: { label: 'Market', description: 'Market research and competitive intel' },
  debriefs: { label: 'Debriefs', description: 'Call transcripts and meeting notes' },
  exports: { label: 'Exports', description: 'Exported deliverables and artifacts' },
  meta: { label: 'Meta', description: 'Wiki metadata and configuration' },
  schema: { label: 'Schema', description: 'Database schema documentation' },
};

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function WikiPage({ params }: PageProps) {
  const { slug } = await params;

  // Homepage
  if (!slug || slug.length === 0) {
    const [health, recent, articles] = await Promise.all([
      getWikiHealth(),
      getRecentArticles(8),
      getAllArticles(),
    ]);
    const categoryCounts: Record<string, number> = {};
    for (const a of articles) {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    }
    return <WikiHome health={health} recent={recent} categoryCounts={categoryCounts} />;
  }

  // Category listing
  if (slug.length === 1 && CATEGORY_META[slug[0]]) {
    const category = slug[0];
    const meta = CATEGORY_META[category];
    const allArticles = await getAllArticles();
    const articles = allArticles.filter((a) => a.category === category);

    return (
      <DocsPage>
        <DocsTitle>{meta.label}</DocsTitle>
        <DocsDescription>{meta.description}</DocsDescription>
        <DocsBody>
          <div className="not-prose divide-y divide-fd-border rounded-lg border border-fd-border overflow-hidden">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.slug}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-fd-accent/5 transition-colors no-underline"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{article.title}</div>
                  {article.tags?.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {article.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-fd-accent/10 text-fd-muted-foreground border border-fd-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {article.confidence && (
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                      article.confidence === 'high'
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : article.confidence === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-500/10 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {article.confidence}
                  </span>
                )}
                <span className="text-[11px] tabular-nums text-fd-muted-foreground shrink-0">
                  {new Date(article.updated_at).toLocaleDateString('en-CA')}
                </span>
              </Link>
            ))}
          </div>
        </DocsBody>
      </DocsPage>
    );
  }

  // Article page
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
