import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

interface LayoutProps {
  children: ReactNode;
}

import Head from "next/head";

const Layout = ({ children }: LayoutProps) => (
  <div className="bg-white min-h-screen text-gray-900 font-sans">
    <Head>
      <title>Dalimss News — Varanasi, Gurugram &amp; India News</title>
      <meta name="description" content="Dalimss News is a digital news publication covering Varanasi, Gurugram, Delhi-NCR and major stories from across India, including crime, civic affairs, education, business, culture and lifestyle." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#E21B22" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="search" type="application/opensearchdescription+xml" title={SITE_NAME} href={`${SITE_URL}/opensearch.xml`} />
      <link rel="alternate" type="application/rss+xml" title="Dalimss News Feed" href="https://dalimss.news/feed.xml" />
      <link rel="alternate" type="application/rss+xml" title="Varanasi News Feed" href="https://dalimss.news/varanasi/feed.xml" />
      <link rel="alternate" type="application/rss+xml" title="Gurugram News Feed" href="https://dalimss.news/gurugram/feed.xml" />
      <link rel="alternate" type="application/rss+xml" title="Education News Feed" href="https://dalimss.news/education/feed.xml" />
      <link rel="alternate" type="application/rss+xml" title="Technology News Feed" href="https://dalimss.news/technology/feed.xml" />
      <link rel="alternate" type="application/rss+xml" title="Dalimss News Podcasts" href="https://dalimss.news/ott/feed.xml" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      {/* Google AdSense */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7477796529453554" crossOrigin="anonymous"></script>
    </Head>
    <Nav />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
