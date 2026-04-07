import { supabase } from './supabase';

// ── Types ──────────────────────────────────────────────────────────
export interface WikiArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  tags: string[];
  confidence: string | null;
  status: string;
  backlinks: string[];
  created_at: string;
  updated_at: string;
}

export interface WikiHealth {
  total_articles: number;
  categories: number;
  avg_confidence: number;
  last_updated: string;
}

// ── Category labels ────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  identity: 'Identity',
  audience: 'Audience',
  offers: 'Offers',
  outbound: 'Outbound',
  strategy: 'Strategy',
  design: 'Design',
  platform: 'Platform',
  operations: 'Operations',
  market: 'Market',
  debriefs: 'Debriefs',
  exports: 'Exports',
};

const CATEGORY_ORDER = [
  'identity', 'audience', 'offers', 'outbound', 'strategy',
  'design', 'platform', 'operations', 'market', 'debriefs', 'exports',
];

// ── Data fetchers ──────────────────────────────────────────────────
export async function getAllArticles(): Promise<WikiArticle[]> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .order('category')
    .order('title');
  if (error) return [];
  return data ?? [];
}

export async function getArticleBySlug(slugParts: string[]): Promise<WikiArticle | null> {
  const fullSlug = slugParts.join('/');

  // Try exact slug match first
  let { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .eq('slug', fullSlug)
    .single();

  if (!error && data) return data;

  // Fallback: last part is the slug, first part is the category
  if (slugParts.length >= 2) {
    const category = slugParts[0];
    const articleSlug = slugParts[slugParts.length - 1];
    const { data: fallback } = await supabase
      .from('wiki_articles')
      .select('*')
      .eq('category', category)
      .eq('slug', articleSlug)
      .single();
    if (fallback) return fallback;
  }

  return null;
}

export async function getWikiHealth(): Promise<WikiHealth | null> {
  const { data, error } = await supabase
    .from('wiki_health')
    .select('*')
    .single();
  if (error) return null;
  return data;
}

export async function getRecentArticles(limit = 8): Promise<WikiArticle[]> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

export async function searchWiki(query: string): Promise<WikiArticle[]> {
  const { data, error } = await supabase.rpc('search_wiki', { search_query: query });
  if (error) return [];
  return data ?? [];
}

// ── Fumadocs page tree builder ─────────────────────────────────────
// Builds the tree structure that DocsLayout expects for its sidebar.
// See: https://www.fumadocs.dev/docs/headless/page-tree

export async function buildPageTree() {
  const articles = await getAllArticles();

  // Group by category
  const grouped: Record<string, WikiArticle[]> = {};
  for (const a of articles) {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  }

  // Build tree: each category is a folder, each article is a page
  const children = CATEGORY_ORDER
    .filter((cat) => grouped[cat])
    .map((cat) => ({
      type: 'folder' as const,
      name: CATEGORY_LABELS[cat] ?? cat,
      index: {
        type: 'page' as const,
        name: CATEGORY_LABELS[cat] ?? cat,
        url: `/${cat}`,
      },
      children: grouped[cat].map((article) => ({
        type: 'page' as const,
        name: article.title,
        url: `/${article.slug}`,
      })),
    }));

  // Include any categories not in the predefined order
  const extra = Object.keys(grouped)
    .filter((cat) => !CATEGORY_ORDER.includes(cat))
    .map((cat) => ({
      type: 'folder' as const,
      name: CATEGORY_LABELS[cat] ?? cat,
      index: {
        type: 'page' as const,
        name: CATEGORY_LABELS[cat] ?? cat,
        url: `/${cat}`,
      },
      children: grouped[cat].map((article) => ({
        type: 'page' as const,
        name: article.title,
        url: `/${article.slug}`,
      })),
    }));

  return {
    name: 'D4TW Wiki',
    children: [...children, ...extra],
  };
}
