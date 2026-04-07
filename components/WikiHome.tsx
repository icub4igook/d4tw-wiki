import Link from 'next/link';
import type { WikiArticle, WikiHealth } from '@/lib/wiki';

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
};

interface WikiHomeProps {
  health: WikiHealth | null;
  recent: WikiArticle[];
  categoryCounts: Record<string, number>;
}

export function WikiHome({ health, recent, categoryCounts }: WikiHomeProps) {
  const categories = Object.entries(categoryCounts).sort(([a], [b]) => {
    const order = Object.keys(CATEGORY_META);
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Brand Wiki</h1>
      <p className="text-sm text-fd-muted-foreground mb-8">
        D4TW internal knowledge base — strategy, brand, operations, and market intelligence.
      </p>

      {/* Health stats */}
      {health && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Articles', value: health.total_articles },
            { label: 'Categories', value: health.categories },
            { label: 'Last updated', value: new Date(health.last_updated).toLocaleDateString('en-CA') },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-4 py-3 rounded-lg border border-fd-border bg-fd-card"
            >
              <div className="text-lg font-semibold tabular-nums">{stat.value}</div>
              <div className="text-xs text-fd-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Categories */}
      <h2 className="text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground mb-3">
        Categories
      </h2>
      <div className="grid grid-cols-2 gap-2 mb-10">
        {categories.map(([cat, count]) => {
          const meta = CATEGORY_META[cat];
          return (
            <Link
              key={cat}
              href={`/${cat}`}
              className="px-4 py-3 rounded-lg border border-fd-border bg-fd-card hover:bg-fd-accent/5 transition-colors no-underline"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-medium">{meta?.label ?? cat}</span>
                <span className="text-[11px] tabular-nums text-fd-muted-foreground">{count}</span>
              </div>
              <p className="text-xs text-fd-muted-foreground">{meta?.description ?? ''}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent articles */}
      <h2 className="text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground mb-3">
        Recently Updated
      </h2>
      <div className="rounded-lg border border-fd-border overflow-hidden divide-y divide-fd-border">
        {recent.map((article) => (
          <Link
            key={article.id}
            href={`/${article.slug}`}
            className="flex items-center gap-3 px-4 py-2.5 bg-fd-card hover:bg-fd-accent/5 transition-colors no-underline"
          >
            <span className="text-sm flex-1 truncate">{article.title}</span>
            <span className="text-[11px] tabular-nums text-fd-muted-foreground shrink-0">
              {new Date(article.updated_at).toLocaleDateString('en-CA')}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
