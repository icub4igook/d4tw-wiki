import { supabase } from './supabase'

export interface WikiArticle {
  id: string
  title: string
  slug: string
  category: string
  content: string
  tags: string[]
  confidence: string | null
  status: string
  backlinks: string[]
  created_at: string
  updated_at: string
}

export interface WikiHealth {
  total_articles: number
  categories: number
  avg_confidence: number
  last_updated: string
}

export interface CategorySummary {
  category: string
  count: number
}

export async function getArticle(category: string, slug: string): Promise<WikiArticle | null> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .eq('category', category)
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}

export async function getArticlesByCategory(category: string): Promise<WikiArticle[]> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .eq('category', category)
    .order('title')
  if (error) return []
  return data ?? []
}

export async function getAllCategories(): Promise<CategorySummary[]> {
  const { data, error } = await supabase
    .from('wiki_by_category')
    .select('*')
    .order('category')
  if (error) return []
  return data ?? []
}

export async function getWikiHealth(): Promise<WikiHealth | null> {
  const { data, error } = await supabase
    .from('wiki_health')
    .select('*')
    .single()
  if (error) return null
  return data
}

export async function getRecentArticles(limit = 8): Promise<WikiArticle[]> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return data ?? []
}

export async function searchWiki(query: string): Promise<WikiArticle[]> {
  const { data, error } = await supabase
    .rpc('search_wiki', { search_query: query })
  if (error) return []
  return data ?? []
}

export async function getAllArticles(): Promise<WikiArticle[]> {
  const { data, error } = await supabase
    .from('wiki_articles')
    .select('*')
    .order('category')
    .order('title')
  if (error) return []
  return data ?? []
}

export function getBacklinkArticles(slug: string, allArticles: WikiArticle[]): WikiArticle[] {
  return allArticles.filter(a =>
    a.backlinks?.includes(slug) ||
    a.content?.includes(`[[${slug}]]`) ||
    a.content?.includes(`](/${slug})`)
  )
}

// Category metadata
export const CATEGORY_META: Record<string, { label: string; icon: string; description: string }> = {
  identity:   { label: 'Identity',   icon: '◆', description: 'Brand positioning, voice, and values' },
  audience:   { label: 'Audience',   icon: '◎', description: 'Target segments and personas' },
  offers:     { label: 'Offers',     icon: '▣', description: 'Products, services, and pricing' },
  outbound:   { label: 'Outbound',   icon: '▸', description: 'Sales, outreach, and partnerships' },
  strategy:   { label: 'Strategy',   icon: '◇', description: 'Business strategy and planning' },
  design:     { label: 'Design',     icon: '△', description: 'Visual identity and design system' },
  platform:   { label: 'Platform',   icon: '⬡', description: 'Technical architecture and stack' },
  operations: { label: 'Operations', icon: '⚙', description: 'Workflows, SOPs, and processes' },
  market:     { label: 'Market',     icon: '◈', description: 'Market research and competitive intel' },
  debriefs:   { label: 'Debriefs',   icon: '◉', description: 'Call transcripts and meeting notes' },
  exports:    { label: 'Exports',    icon: '↗', description: 'Exported deliverables and artifacts' },
}
