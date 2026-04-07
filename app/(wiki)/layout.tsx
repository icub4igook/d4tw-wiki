import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { buildPageTree } from '@/lib/wiki';
import type { ReactNode } from 'react';

export default async function WikiLayout({ children }: { children: ReactNode }) {
  const tree = await buildPageTree();

  return (
    <DocsLayout
      {...baseOptions()}
      tree={tree}
      sidebar={{
        defaultOpenLevel: 0,
      }}
    >
      {children}
    </DocsLayout>
  );
}
