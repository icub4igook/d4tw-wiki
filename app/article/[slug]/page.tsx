import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sidebar } from "@/components/Sidebar";

export const revalidate = 60;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: article } = await supabase.from("wiki_articles").select("*").eq("slug", slug).single();
  if (!article) notFound();
  
  const { data: allArticles } = await supabase.from("wiki_articles").select("slug, title, category, subcategory");
  
  const backlinks = article.backlinks || [];
  const { data: linked } = await supabase.from("wiki_articles").select("slug, title, category")
    .in("slug", backlinks.length > 0 ? backlinks : ["__none__"]);
  
  const { data: inbound } = await supabase.from("wiki_articles").select("slug, title, category")
    .contains("backlinks", [slug]);
  
  const processed = article.content
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "[$2](/article/$1)")
    .replace(/\[\[([^\]]+)\]\]/g, "[$1](/article/$1)");
  
  return (
    <div className="page-wrapper">
      <Sidebar articles={allArticles || []} />
      <div style={{ flex: 1 }}>
        <div className="header-bar">
          <div><Link href="/" style={{color:"var(--text)",fontWeight:600}}>D4TW Wiki</Link></div>
          <div>
            <Link href={`/category/${article.category}`}>{article.category}</Link>
            <Link href="/search">Search</Link>
          </div>
        </div>
        <div className="main-content">
          <div className="article-layout">
            <div className="article-content">
              <span className={`cat-badge cat-badge-${article.category}`}>{article.category}</span>
              {article.subcategory && <span style={{color:"var(--text-light)",fontSize:"0.8rem",marginLeft:"0.5rem"}}>{article.subcategory}</span>}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{processed}</ReactMarkdown>
              <div className="article-meta">
                <strong>Confidence:</strong> {article.confidence} &middot; <strong>Status:</strong> {article.status} &middot; <strong>Words:</strong> {article.word_count} &middot; <strong>Reviewed:</strong> {article.last_reviewed}
              </div>
            </div>
            <aside>
              {linked && linked.length > 0 && (
                <div className="related-box">
                  <h3>Links to</h3>
                  {linked.map(l => <Link key={l.slug} href={`/article/${l.slug}`}>{l.title}</Link>)}
                </div>
              )}
              {inbound && inbound.length > 0 && (
                <div className="related-box">
                  <h3>Linked from</h3>
                  {inbound.map(l => <Link key={l.slug} href={`/article/${l.slug}`}>{l.title}</Link>)}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
