import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { DropMenu } from "@/components/dropmenu"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kanji Flashcards",
  description: "Learn kanji with flashcards and swipe gestures",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* dropdown btn */}
      <div className="absolute top-5 right-5">
        <DropMenu />
      </div>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

