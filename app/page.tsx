import { supabase } from "@/lib/supabase";
import { daysUntilExpiry } from "@/lib/auth";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

const BADGE: Record<string, string> = {
  identity:"cat-badge-identity",audience:"cat-badge-audience",offers:"cat-badge-offers",
  outbound:"cat-badge-outbound",strategy:"cat-badge-strategy",design:"cat-badge-design",
  platform:"cat-badge-platform",operations:"cat-badge-operations",debriefs:"cat-badge-debriefs",
  market:"cat-badge-market",meta:"cat-badge-meta",
};

const CAT_DESC: Record<string, string> = {
  identity:"Brand identity, founder, positioning",
  audience:"ICP, client profiles, industries, language",
  offers:"Value ladder, pricing, products",
  proof:"Testimonials, case studies, metrics",
  voice:"Tone, patterns, teaching style",
  market:"Competitive landscape, trends",
  strategy:"Content, email, GTM, build-in-public",
  outbound:"Cold pipeline, warm nurture, KPIs",
  design:"Visual identity, palettes, accessibility",
  platform:"Architecture, database, RBAC, DR",
  operations:"SOPs, workflows, skills matrix",
  debriefs:"Post-call analysis and coaching notes",
  frameworks:"Proprietary methods and models",
  meta:"Wiki structure and maintenance",
};

export const revalidate = 60;

export default async function HomePage() {
  const { data: articles } = await supabase
    .from("wiki_articles")
    .select("id, slug, title, category, subcategory, word_count, status, updated_at")
    .order("updated_at", { ascending: false });
  
  if (!articles) return <div>Error loading wiki</div>;
  
  const totalWords = articles.reduce((s, a) => s + (a.word_count || 0), 0);
  const cats: Record<string, number> = {};
  articles.forEach(a => { cats[a.category] = (cats[a.category] || 0) + 1; });
  const recent = articles.slice(0, 6);
  const days = daysUntilExpiry();
  const activeCount = articles.filter(a => a.status === "active").length;
  
  return (
    <>
      {days <= 7 && (
        <div className={`expiry-bar ${days <= 3 ? "danger" : "warning"}`}>
          Password expires in {days} day{days !== 1 ? "s" : ""}. Update WIKI_PASSWORD_HASH in Vercel.
        </div>
      )}
      <div className="page-wrapper">
        <Sidebar articles={articles} />
        <div style={{ flex: 1 }}>
          <div className="header-bar">
            <div><Link href="/" style={{color:"var(--text)",fontWeight:600}}>D4TW Wiki</Link></div>
            <div style={{display:"flex",alignItems:"center"}}>
              <Link href="/search">Search</Link>
            </div>
          </div>
          <div className="main-content">
            <h1 className="wiki-title">Welcome to D4TW Wiki</h1>
            <p className="wiki-subtitle">the brand intelligence base for Design for the Web</p>
            <p className="wiki-stats">{articles.length} articles across {Object.keys(cats).length} categories &middot; {totalWords.toLocaleString()} words</p>
            
            <div className="two-col">
              <div className="section-box">
                <div className="section-header" style={{background:"var(--accent-strategy)",borderColor:"var(--accent-strategy-border)"}}>About</div>
                <div className="section-body" style={{fontSize:"0.88rem"}}>
                  <p>D4TW Wiki is a structured brand intelligence system compiled from strategic planning documents, call transcripts, and operational references.</p>
                  <p style={{marginTop:"0.5rem"}}>It serves as the context layer for all AI agents — content writers, copy coaches, sales page builders, and email generators. Every claim is sourced. The wiki evolves with every new Fireflies transcription through the automated Filing Loop.</p>
                </div>
              </div>
              <div className="section-box">
                <div className="section-header" style={{background:"var(--accent-offers)",borderColor:"var(--accent-offers-border)"}}>Wiki Health</div>
                <div className="section-body">
                  <div className="health-grid">
                    <div className="health-stat"><div className="num">{articles.length}</div><div className="label">Articles</div></div>
                    <div className="health-stat"><div className="num">{totalWords.toLocaleString()}</div><div className="label">Words</div></div>
                    <div className="health-stat"><div className="num">{activeCount}/{articles.length}</div><div className="label">Active</div></div>
                    <div className="health-stat"><div className="num">{Object.keys(cats).length}</div><div className="label">Categories</div></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="section-box" style={{marginTop:"1rem"}}>
              <div className="section-header" style={{background:"var(--accent-audience)",borderColor:"var(--accent-audience-border)"}}>Recently Updated</div>
              <div className="section-body">
                <ul className="recent-list">
                  {recent.map(a => (
                    <li key={a.slug}>
                      <Link href={`/article/${a.slug}`}>{a.title}</Link>
                      <span className="date">({a.updated_at?.slice(0,10)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="section-box" style={{marginTop:"1rem"}}>
              <div className="section-header" style={{background:"var(--accent-identity)",borderColor:"var(--accent-identity-border)"}}>Browse by Category</div>
              <div className="section-body">
                <div className="category-browse">
                  {Object.entries(cats).sort((a,b) => b[1]-a[1]).map(([cat, count]) => (
                    <div className="category-item" key={cat}>
                      <Link href={`/category/${cat}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Link>
                      <span> — {CAT_DESC[cat] || ""} ({count})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
