"use client";
import Link from "next/link";
import { useState } from "react";

type Article = { slug: string; title: string; category: string; subcategory: string | null };

export function Sidebar({ articles }: { articles: Article[] }) {
  const grouped: Record<string, Article[]> = {};
  articles.forEach(a => {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  });
  
  // Sort categories
  const order = ["identity","audience","offers","voice","proof","market","strategy","outbound","design","platform","operations","debriefs","frameworks","meta"];
  const sorted = order.filter(c => grouped[c]).concat(Object.keys(grouped).filter(c => !order.includes(c)));
  
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(sorted.map(c => [c, true]))
  );
  
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>D4TW Wiki</h2>
        <p>Brand Intelligence Base</p>
      </div>
      {sorted.map(cat => (
        <div className="sidebar-category" key={cat}>
          <div className="sidebar-category-header" onClick={() => setOpen(p => ({...p, [cat]: !p[cat]}))}>
            <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
            <span className="count">{grouped[cat].length} &bull;</span>
          </div>
          {open[cat] && grouped[cat].sort((a,b) => a.title.localeCompare(b.title)).map(a => {
            // Group by subcategory
            return (
              <Link key={a.slug} href={`/article/${a.slug}`} className="sidebar-link">
                {a.title}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
