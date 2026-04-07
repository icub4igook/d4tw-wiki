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

const CATEGORIES: Record<string, { label: string; desc: string }> = {
  identity: { label: 'Identity', desc: 'Brand positioning, voice, and values' },
  audience: { label: 'Audience', desc: 'Target segments and personas' },
  offers: { label: 'Offers', desc: 'Products, services, and pricing' },
  outbound: { label: 'Outbound', desc: 'Sales, outreach, and partnerships' },
  strategy: { label: 'Strategy', desc: 'Business strategy and planning' },
  design: { label: 'Design', desc: 'Visual identity and design system' },
  platform: { label: 'Platform', desc: 'Technical architecture and stack' },
  operations: { label: 'Operations', desc: 'Workflows, SOPs, and processes' },
  market: { label: 'Market', desc: 'Market research and competitive intel' },
  debriefs: { label: 'Debriefs', desc: 'Call transcripts and meeting notes' },
  exports: { label: 'Exports', desc: 'Exported deliverables and artifacts' },
  meta: { label: 'Meta', desc: 'Wiki metadata' },
  schema: { label: 'Schema', desc: 'Database schema docs' },
};

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function WikiPage({ params }: PageProps) {
  const { slug } = await params;

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
    return (
      <WikiHome
        health={health}
        recent={recent}
        categoryCounts={categoryCounts}
      />
    );
  }

  if (slug.length === 1 && CATEGORIES[slug[0]]) {
    const category = slug[0];
    const meta = CATEGORIES[category];
    const allArticles = await getAllArticles();
    const articles = allArticles.filter((a) => a.category === category);

    return (
      <DocsPage>
        <DocsTitle>{meta.label}</DocsTitle>
        <DocsDescription>{meta.desc}</DocsDescription>
        <DocsBody>
          <div className="not-prose divide-y divide-fd-border rounded-lg border border-fd-border overflow-hidden">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={'/' + article.slug}
                className="flex items-center gap-3 px-4 py-3 hover:bg-fd-accent/5 transition-colors no-underline"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {article.title}
                  </div>
                  {article.tags && article.tags.length > 0 && (
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
                    className={
                      'text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ' +
                      (article.confidence === 'high'
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : article.confidence === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-500/10 text-red-700 dark:text-red-400')
                    }
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

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const toc = await getTableOfContents(article.content || '');

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{article.title}</DocsTitle>
      <DocsDescription>
        {article.tags && article.tags.length > 0 && (
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
                className={
                  'text-xs px-2 py-0.5 rounded-md font-medium ' +
                  (article.confidence === 'high'
                    ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                    : article.confidence === 'medium'
                      ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                      : 'bg-red-500/10 text-red-700 dark:text-red-400')
                }
              >
                {article.confidence} confidence
              </span>
            )}
          </span>
        )}
      </DocsDescription>
      <DocsBody>
        <MarkdownRenderer content={article.content || ''} />
        <div className="mt-8 pt-4 border-t border-fd-border text-xs text-fd-muted-foreground flex gap-3">
          <span>
            {'Created '}
            {new Date(article.created_at).toLocaleDateString('en-CA')}
          </span>
          <span>&middot;</span>
          <span>
            {'Updated '}
            {new Date(article.updated_at).toLocaleDateString('en-CA')}
          </span>
          {article.status && (
            <>
              <span>&middot;</span>
              <span className="capitalize">{article.status}</span>
            </>
          )}
        </div>
      </DocsBody>
    </DocsPage>
  );
}
