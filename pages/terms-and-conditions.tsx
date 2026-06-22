import Head from "next/head";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Head>
        <title>Terms and Conditions | Dalimss News</title>
        <meta
          name="description"
          content="Read the terms and conditions for using Dalimss News website, including content ownership and liability."
        />
        <link rel="canonical" href="https://dalimss.news/terms-and-conditions" />
      </Head>

      <Nav />

      <main className="container mx-auto px-4 py-12 max-w-3xl bg-white shadow-sm border border-gray-200 mt-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="prose max-w-none text-gray-800 space-y-6">
          <p>Last updated: June 2026</p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Dalimss News (https://dalimss.news), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Content Ownership</h2>
            <p>
              All content on Dalimss News, including text, graphics, logos, images, and software, is the property of Dalimss News Network and is protected by Indian and international copyright laws. Unauthorized reproduction or redistribution of this content is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Use of Website</h2>
            <p>
              You may not use our website for any unlawful purpose or in any way that could damage, disable, overburden, or impair the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Limitation of Liability</h2>
            <p>
              Dalimss News shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the website.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
