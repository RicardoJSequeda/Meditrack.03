import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ClientLayout from "./ClientLayout"
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MediTrack - Tu Asistente Personal de Salud",
  description: "Gestiona tu salud diaria de manera eficiente con MediTrack",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}