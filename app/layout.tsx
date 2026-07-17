import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Cary Grant Clothing — Premium Canadian Streetwear',
    template: '%s | Cary Grant Clothing',
  },
  description: 'Premium Canadian streetwear for the whole family. Hoodies, tracksuits, African prints, women\'s wear and kids clothing. Est. 2002, Barrie, Ontario.',
  keywords: ['Cary Grant Clothing', 'CGC', 'Canadian streetwear', 'premium clothing', 'Barrie Ontario', 'hoodies', 'tracksuits', 'African prints'],
  openGraph: {
    title: 'Cary Grant Clothing — Premium Canadian Streetwear',
    description: 'From a duffle bag to owning the building. Est. 2002, Barrie, Ontario.',
    url: 'https://carygrantclothing.com',
    siteName: 'Cary Grant Clothing',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#141414',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '10px',
              padding: '12px 16px',
              border: '0.5px solid rgba(255,255,255,0.1)',
            },
            success: {
              iconTheme: { primary: '#E0102A', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}
