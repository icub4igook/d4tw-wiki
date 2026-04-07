import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { SearchModal } from '@/components/SearchModal'

export const metadata: Metadata = {
  title: 'D4TW Brand Wiki',
  description: 'Internal brand knowledge base',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Sidebar />
          <Header />
          <SearchModal />
          <main
            className="min-h-screen"
            style={{
              marginLeft: 'var(--sidebar-width)',
              paddingTop: 'var(--header-height)',
            }}
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
