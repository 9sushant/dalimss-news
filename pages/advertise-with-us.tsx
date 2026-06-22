import Head from "next/head";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function AdvertiseWithUs() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Head>
        <title>Advertise With Us | Dalimss News</title>
        <meta
          name="description"
          content="Advertise with Dalimss News. Reach a targeted, growing audience in Varanasi, Uttar Pradesh, and across India."
        />
        <link rel="canonical" href="https://dalimss.news/advertise-with-us" />
      </Head>

      <Nav />

      <main className="container mx-auto px-4 py-12 max-w-3xl bg-white shadow-sm border border-gray-200 mt-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Advertise With Us</h1>
        
        <div className="prose max-w-none text-gray-800 space-y-6">
          <p className="text-lg">
            Dalimss News offers a unique platform to reach an engaged, localized, and rapidly growing audience across Varanasi, Uttar Pradesh, and India. 
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3">Why Advertise with Dalimss News?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Local Authority:</strong> Strong readership base in Varanasi and Purvanchal.</li>
              <li><strong>National Reach:</strong> Growing footprint in Indian national news and specialized verticals (Education, Gadgets, etc.).</li>
              <li><strong>High Quality Content:</strong> We strictly adhere to high editorial standards, ensuring your brand is associated with premium content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Advertising Options</h2>
            <p>We offer various advertising formats to suit your campaign needs:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Display Banner Ads (Homepage & Article pages)</li>
              <li>Sponsored Content & Native Advertorials (Clearly marked as "Sponsored")</li>
              <li>Social Media Promotions (Instagram, Facebook, X)</li>
              <li>Video Pre-roll & Mid-roll integration</li>
            </ul>
          </section>

          <section className="bg-gray-100 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-semibold mb-3">Contact the Sales Team</h2>
            <p className="mb-2">For media kits, pricing, and campaign planning, please reach out directly to our advertising department.</p>
            <p className="font-bold">Email: sales@dalimss.news</p>
            <p className="font-bold">Phone: +91 (XXX) XXX-XXXX</p>
            <p className="text-sm text-gray-600 mt-4">
              Note: The advertising team operates independently from our editorial newsroom to maintain strict editorial integrity.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
