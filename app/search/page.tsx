"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase.from("wiki_articles")
        .select("slug, title, category, word_count, content")
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(20);
      setResults(data || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"2rem 1.5rem"}}>
      <h1 style={{fontSize:"1.4rem",marginBottom:"1rem"}}>
        <Link href="/" style={{color:"var(--text)"}}>D4TW Wiki</Link> &mdash; Search
      </h1>
      <input className="search-page-input" type="text" placeholder="Search articles..." value={query} onChange={e => setQuery(e.target.value)} autoFocus />
      <div className="search-status">{loading ? "Searching..." : query.length >= 2 ? `${results.length} results` : "Type to search"}</div>
      {results.map(a => {
        const idx = a.content?.toLowerCase().indexOf(query.toLowerCase()) || -1;
        const snippet = idx >= 0 ? "..." + a.content.slice(Math.max(0, idx - 60), idx + 120).replace(/\n/g, " ") + "..." : "";
        return (
          <div className="search-result" key={a.slug}>
            <Link href={`/article/${a.slug}`} className="title">{a.title}</Link>
            <span className="cat-label">{a.category}</span>
            {snippet && <p className="snippet">{snippet}</p>}
          </div>
        );
      })}
    </div>
  );
}
