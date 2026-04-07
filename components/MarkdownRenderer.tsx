import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

function resolveWikiLinks(content: string): string {
  return content.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (_match, slug, display) => {
      const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');
      const label = display?.trim() || slug.trim();
      return '[' + label + '](/' + cleanSlug + ')';
    }
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  const resolved = resolveWikiLinks(content);
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
      {resolved}
    </ReactMarkdown>
  );
}
