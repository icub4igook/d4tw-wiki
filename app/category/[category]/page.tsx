import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  
  const { data: articles } = await supabase.from("wiki_articles")
    .select("slug, title, category, subcategory, word_count, confidence")
    .eq("category", category).order("title");
  
  const { data: allArticles } = await supabase.from("wiki_articles").select("slug, title, category, subcategory");
  
  return (
    <div className="page-wrapper">
      <Sidebar articles={allArticles || []} />
      <div style={{ flex: 1 }}>
        <div className="header-bar">
          <div><Link href="/" style={{color:"var(--text)",fontWeight:600}}>D4TW Wiki</Link></div>
          <div><Link href="/">Home</Link><Link href="/search">Search</Link></div>
        </div>
        <div className="main-content">
          <h1 className="category-title" style={{textTransform:"capitalize"}}>{category}</h1>
          <p style={{color:"var(--text-muted)",marginBottom:"1rem",fontSize:"0.9rem",fontFamily:"-apple-system,sans-serif"}}>{articles?.length || 0} articles</p>
          <div className="article-list">
            {articles?.map(a => (
              <Link key={a.slug} href={`/article/${a.slug}`} style={{textDecoration:"none",color:"inherit"}}>
                <div className="article-row">
                  <span style={{color:"var(--link)"}}>{a.title}</span>
                  <span className="words">{a.word_count} words</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
