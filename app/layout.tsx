import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4TW Wiki",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
