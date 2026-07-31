import Head from "next/head";
import Link from "next/link";
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  EnvelopeIcon,
  MapPinIcon,
  NewspaperIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const facts = [
  {
    label: "Founded",
    value: "January 2024",
    icon: CalendarDaysIcon,
  },
  {
    label: "Newsroom base",
    value: "Varanasi, Uttar Pradesh",
    icon: MapPinIcon,
  },
  {
    label: "Primary coverage",
    value: "Varanasi and Purvanchal",
    icon: NewspaperIcon,
  },
  {
    label: "Publication",
    value: SITE_NAME,
    icon: BuildingOffice2Icon,
  },
];

export default function AboutPage() {
  const canonicalUrl = `${SITE_URL}/about`;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    foundingDate: "2024-01",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-square.png`,
      width: 512,
      height: 512,
    },
    email: "dalimssnews@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Varanasi",
      addressRegion: "Uttar Pradesh",
      postalCode: "221001",
      addressCountry: "IN",
    },
    areaServed: ["Varanasi", "Purvanchal", "Uttar Pradesh"],
    sameAs: [
      "https://www.instagram.com/dalimss.news.banaras/",
      "https://x.com/dalimss_news",
    ],
    ethicsPolicy: `${SITE_URL}/editorial-policy`,
    correctionsPolicy: `${SITE_URL}/corrections-policy`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Newsroom",
      telephone: "+91-63927-52976",
      email: "dalimssnews@gmail.com",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <>
      <Head>
        <title>About Dalimss News | Varanasi and Purvanchal Newsroom</title>
        <meta
          name="description"
          content="Dalimss News is a Varanasi-based digital publication founded in January 2024, focused on original public-interest reporting from Varanasi and Purvanchal."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`About ${SITE_NAME}`} />
        <meta
          property="og:description"
          content="Publication facts, coverage focus, newsroom standards and contact information for Dalimss News."
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </Head>

      <section className="bg-gray-950 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-red-400 font-semibold uppercase tracking-wider mb-4">
            About {SITE_NAME}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Local reporting, rooted in Varanasi
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">
            Founded in January 2024, Dalimss News is a digital news publication
            based in Varanasi. Our primary focus is original, useful reporting
            on Varanasi and Purvanchal, including civic administration, public
            safety, education, infrastructure, local business, culture,
            tourism and public-interest issues.
          </p>
        </div>
      </section>

      <main>
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Publication facts
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {facts.map(({ label, value, icon: Icon }) => (
                <div key={label} className="border border-gray-200 rounded-xl p-5">
                  <Icon className="h-7 w-7 text-red-600 mb-4" />
                  <p className="text-sm text-gray-500 mb-1">{label}</p>
                  <p className="font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-500">
              We publish quantitative or recognition claims only when they can
              be supported by current, public evidence.
            </p>
          </div>
        </section>

        <section className="py-14 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-7">
              <ShieldCheckIcon className="h-9 w-9 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                How we work
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                We aim to identify authors, distinguish publication and update
                times, link primary material when it is available, explain the
                reporting basis, seek responses from affected parties, and
                correct factual errors transparently.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link className="text-red-700 font-semibold hover:underline" href="/editorial-policy">
                  Editorial policy
                </Link>
                <Link className="text-red-700 font-semibold hover:underline" href="/corrections-policy">
                  Corrections policy
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-7">
              <UserGroupIcon className="h-9 w-9 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Newsroom and bylines
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Our newsroom page lists the named contributors currently
                represented in our published bylines. Each byline links to the
                contributor&apos;s published work.
              </p>
              <Link className="text-red-700 font-semibold hover:underline" href="/authors">
                View our newsroom and contributors
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 bg-gray-900 text-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold mb-8">Contact the newsroom</h2>
            <div className="grid md:grid-cols-3 gap-6 text-gray-300">
              <div>
                <EnvelopeIcon className="h-6 w-6 text-red-500 mb-3" />
                <h3 className="text-white font-semibold mb-1">Email</h3>
                <a className="hover:text-white" href="mailto:dalimssnews@gmail.com">
                  dalimssnews@gmail.com
                </a>
              </div>
              <div>
                <PhoneIcon className="h-6 w-6 text-red-500 mb-3" />
                <h3 className="text-white font-semibold mb-1">Phone</h3>
                <a className="hover:text-white" href="tel:+916392752976">
                  +91 63927 52976
                </a>
              </div>
              <div>
                <MapPinIcon className="h-6 w-6 text-red-500 mb-3" />
                <h3 className="text-white font-semibold mb-1">Location</h3>
                <p>Varanasi, Uttar Pradesh, India – 221001</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
