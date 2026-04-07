import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60;

export default async function HomePage() {
  const [healthRes, categoriesRes, recentRes] = await Promise.all([
    supabase.from('wiki_health').select('*').single(),
    supabase.from('wiki_by_category').select('*'),
    supabase.from('wiki_articles')
      .select('slug, title, category, updated_at, word_count')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(8),
  ]);

  const health = healthRes.data;
  const categories = categoriesRes.data || [];
  const recent = recentRes.data || [];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>D4TW Wiki</h1>
        <p style={{ color: '#666' }}>Brand intelligence base for Design for the Web</p>
        {health && (
          <p style={{ color: '#999', fontSize: '0.875rem' }}>
            {health.total_articles} articles · {health.total_words?.toLocaleString()} words · {health.categories} categories
          </p>
        )}
      </div>

      {health && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Articles', value: health.active_articles },
            { label: 'Words', value: health.total_words?.toLocaleString() },
            { label: 'High Confidence', value: health.high_confidence },
            { label: 'Debriefs', value: health.total_debriefs },
          ].map((s) => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: '1rem', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.75rem' }}>Recently Updated</h2>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: '2rem' }}>
        {recent.map((a: any) => (
          <a key={a.slug} href={`/article/${a.slug}`}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', textDecoration: 'none', color: 'inherit' }}>
            <span>
              <span style={{ fontSize: '0.7rem', background: '#f3f4f6', padding: '2px 8px', borderRadius: 99, marginRight: 8 }}>{a.category}</span>
              <span style={{ fontSize: '0.875rem' }}>{a.title}</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: '#999' }}>{new Date(a.updated_at).toLocaleDateString()}</span>
          </a>
        ))}
      </div>

      <h2 style={{ fontSize: '1rem', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.75rem' }}>Browse by Category</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {categories.filter((c: any) => !['meta', 'schema'].includes(c.category)).map((c: any) => (
          <a key={c.category} href={`/category/${c.category}`}
            style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize' }}>{c.category}</div>
            <div style={{ fontSize: '0.75rem', color: '#999' }}>{c.article_count} articles</div>
          </a>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <a href="/search" style={{ color: '#2563eb', fontSize: '0.875rem' }}>Search the wiki →</a>
      </div>
    </div>
  );
}
