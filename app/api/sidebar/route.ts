import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/wiki'

export async function GET() {
  const articles = await getAllArticles()
  const grouped: Record<string, { category: string; count: number; articles: { title: string; slug: string; category: string }[] }> = {}

  for (const a of articles) {
    if (!grouped[a.category]) grouped[a.category] = { category: a.category, count: 0, articles: [] }
    grouped[a.category].count++
    grouped[a.category].articles.push({ title: a.title, slug: a.slug, category: a.category })
  }

  const order = ['identity', 'audience', 'offers', 'outbound', 'strategy', 'design', 'platform', 'operations', 'market', 'debriefs', 'exports']
  const sorted = order.filter(c => grouped[c]).map(c => grouped[c])

  return NextResponse.json(sorted)
}
