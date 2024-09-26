import type {Metadata} from "next"
import React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "news",
  description: "",
}

const RootLayout =({children}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ja">
    <body>
    <main>
      <section className="relative w-full h-full min-h-screen">
        {children}
      </section>
    </main>
    </body>
    </html>
  )
}

export default RootLayout;