import type { Metadata } from 'next'
import './globals.scss'
import { GeistSans } from 'geist/font'
import { Navbar } from '@/Components/Navbar/Navbar'
import 'react-calendar/dist/Calendar.css';

export const metadata: Metadata = {
  title: 'AirTecFive',
  description: 'Proyecto EEST N°5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
