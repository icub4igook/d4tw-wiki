import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D4TW Wiki',
  description: 'Brand intelligence wiki',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#fafafa', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
