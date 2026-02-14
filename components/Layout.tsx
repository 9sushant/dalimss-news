import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

import Head from "next/head";

const Layout = ({ children }: LayoutProps) => (
  <div className="bg-white min-h-screen text-gray-900 font-sans">
    <Head>
      <title>Dalimss News</title>
      <meta name="description" content="Dalimss News is a rapidly growing social media-based news channel that has emerged as one of the most viewed and influential platforms in Purvanchal. Established in February 2024, Dalimss News has set a new benchmark in digital journalism by amassing an impressive following of 120,000 subscribers on Instagram and 177,000 followers on YouTube within just one year. This meteoric rise is a testament to the channel's ability to connect with the people, report impactful stories, and bring attention to the issues that truly matter, particularly in the city of Varanasi. It has successfully created a space where the voices of the common people are amplified, making it an indispensable source of local news and social awareness." />
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      {/* Google AdSense */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7477796529453554" crossOrigin="anonymous"></script>
    </Head>
    <Nav />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
