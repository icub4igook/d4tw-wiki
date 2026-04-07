'use client'

import { useMemo } from 'react'

function toId(text: string) {
  return text.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '')
}

function renderMarkdown(md: string): string {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Headings with IDs
    .replace(/^#### (.+)$/gm, (_, t) => `<h4 id="${toId(t)}">${t}</h4>`)
    .replace(/^### (.+)$/gm, (_, t) => `<h3 id="${toId(t)}">${t}</h3>`)
    .replace(/^## (.+)$/gm, (_, t) => `<h2 id="${toId(t)}">${t}</h2>`)
    .replace(/^# (.+)$/gm, (_, t) => `<h1 id="${toId(t)}">${t}</h1>`)
    // Bold, italic, inline code
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // HR
    .replace(/^---$/gm, '<hr />')
    // Blockquotes
    .replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered lists
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Paragraphs — wrap loose lines
    .replace(/^(?!<[huplbio]|<li|<hr|<pre|<code|<block)(.+)$/gm, '<p>$1</p>')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')

  return html
}

export function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content])
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
}
