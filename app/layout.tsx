import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fingerprint Observatory",
  description: "Live browser fingerprint dashboard"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
