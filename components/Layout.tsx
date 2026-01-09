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
      <meta name="description" content="Dalimss News - Latest Updates" />
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="apple-touch-icon" href="/favicon.png" />
    </Head>
    <Nav />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
