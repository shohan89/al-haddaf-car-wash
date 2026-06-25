import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'
import { getSiteSettings } from '@/actions/settings-actions'
import { SITE_SETTINGS_DEFAULTS } from '@/data/site-settings-defaults'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' })

export const viewport: Viewport = {
  themeColor: '#1A5490',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  let settings = SITE_SETTINGS_DEFAULTS
  try {
    settings = await getSiteSettings()
  } catch {
    // fall back to defaults
  }
  return {
    title: {
      default: settings.seo.defaultTitle,
      template: settings.seo.titleTemplate,
    },
    description: settings.seo.defaultDescription,
    keywords: settings.seo.keywords,
    metadataBase: new URL(settings.seo.canonicalUrl || 'https://alhaddafcarwash.ae'),
    openGraph: {
      type: 'website',
      title: settings.seo.defaultTitle,
      description: settings.seo.defaultDescription,
      images: [{ url: settings.seo.ogImage }],
    },
    ...(settings.scripts.googleSiteVerification ? {
      verification: { google: settings.scripts.googleSiteVerification },
    } : {}),
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let settings = SITE_SETTINGS_DEFAULTS
  try {
    settings = await getSiteSettings()
  } catch {
    // fall back to defaults
  }
  const { googleAnalyticsId, googleTagManagerId: rawGtmId, facebookPixelId, customHeadScripts, customBodyScripts } = settings.scripts
  const googleTagManagerId = rawGtmId || 'GTM-T5Z35PVB'

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager */}
        {googleTagManagerId && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${googleTagManagerId}');
            `}
          </Script>
        )}

        {/* Facebook Pixel */}
        {facebookPixelId && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${facebookPixelId}');
              fbq('track','PageView');
            `}
          </Script>
        )}

        {/* Custom head scripts */}
        {customHeadScripts && (
          <div dangerouslySetInnerHTML={{ __html: customHeadScripts }} />
        )}
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans text-foreground antialiased',
          inter.variable,
          outfit.variable
        )}
      >
        {/* GTM noscript fallback */}
        {googleTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* Custom body scripts */}
        {customBodyScripts && (
          <div dangerouslySetInnerHTML={{ __html: customBodyScripts }} />
        )}

        {children}
      </body>
    </html>
  )
}
