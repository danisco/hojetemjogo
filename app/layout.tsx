import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hojetemjogo.com.br'),
  title: {
    default: 'Hoje Tem Jogo — Jogos de Hoje ao Vivo | Onde Assistir',
    template: '%s | Hoje Tem Jogo',
  },
  description:
    'Veja os jogos de hoje, horários e onde assistir ao vivo na TV e streaming. Brasileirão, Libertadores, Copa do Brasil e muito mais.',
  keywords: [
    'jogos de hoje',
    'jogos de hoje ao vivo',
    'onde assistir futebol hoje',
    'jogos de futebol hoje',
    'brasileirão hoje',
    'libertadores hoje',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Hoje Tem Jogo',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        {/* Google AdSense — lazyOnload avoids blocking LCP */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
