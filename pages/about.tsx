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
    label: "Editorial bases",
    value: "Varanasi and Gurugram",
    icon: MapPinIcon,
  },
  {
    label: "Core coverage",
    value: "Varanasi, Eastern Uttar Pradesh, Gurugram and Delhi-NCR",
    icon: NewspaperIcon,
  },
  {
    label: "Wider coverage",
    value: "India, education, business, technology, health, culture and sport",
    icon: NewspaperIcon,
  },
  {
    label: "Publication type",
    value: "Digital news publication",
    icon: BuildingOffice2Icon,
  },
  {
    label: "Publisher",
    value: "PAMF DIGIMEDIA PRIVATE LIMITED",
    icon: BuildingOffice2Icon,
  },
];

export default function AboutPage() {
  const canonicalUrl = `${SITE_URL}/about`;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    legalName: "PAMF DIGIMEDIA PRIVATE LIMITED",
    url: SITE_URL,
    foundingDate: "2024-01",
    description:
      "Dalimss News is a digital news publication reporting from Varanasi, Eastern Uttar Pradesh, Gurugram and Delhi-NCR, with coverage of major developments across India.",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-square.png`,
      width: 512,
      height: 512,
    },
    email: "info@dalimss.news",
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Varanasi",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Gurugram",
        addressRegion: "Haryana",
        addressCountry: "IN",
      },
    ],
    areaServed: [
      "Varanasi",
      "Eastern Uttar Pradesh",
      "Gurugram",
      "Delhi-NCR",
      "India",
    ],
    sameAs: [
      "https://www.instagram.com/dalimss.news.banaras/",
      "https://x.com/dalimss_news",
    ],
    ethicsPolicy: `${SITE_URL}/editorial-policy`,
    correctionsPolicy: `${SITE_URL}/corrections-policy`,
    publishingPrinciples: `${SITE_URL}/editorial-policy`,
    employee: {
      "@type": "Person",
      name: "Saurav Yadav",
      jobTitle: "Editor-in-Chief",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "PAMF DIGIMEDIA PRIVATE LIMITED",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Editorial enquiries",
        telephone: "+91-63927-52976",
        email: "editor@dalimss.news",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        contactType: "General enquiries",
        email: "info@dalimss.news",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>About Dalimss News | Varanasi, Gurugram &amp; India News</title>
        <meta
          name="description"
          content="Learn about Dalimss News, a digital news publication reporting from Varanasi, Eastern Uttar Pradesh, Gurugram and Delhi-NCR, with coverage of major developments across India."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="About Dalimss News | Varanasi, Gurugram & India News"
        />
        <meta
          property="og:description"
          content="Learn about Dalimss News, a digital news publication reporting from Varanasi, Eastern Uttar Pradesh, Gurugram and Delhi-NCR, with coverage of major developments across India."
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
            Local reporting. Wider perspective.
          </h1>
          <div className="space-y-4 text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">
            <p>
              Founded in January 2024, Dalimss News is a digital news publication
              with editorial operations in Varanasi and Gurugram.
            </p>
            <p>
              We publish original reporting from Varanasi, Eastern Uttar Pradesh,
              Gurugram and Delhi-NCR, alongside coverage of significant
              developments from across India. Our journalism covers civic
              administration, public safety, education, infrastructure, business,
              technology, health, culture, tourism, sport and other matters of
              public interest.
            </p>
            <p>
              Our aim is straightforward: to produce timely, credible and
              accessible journalism that keeps readers informed about the places
              in which they live, work and participate.
            </p>
          </div>
        </div>
      </section>

      <main>
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Publication facts
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {facts.map(({ label, value, icon: Icon }) => (
                <div key={label} className="border border-gray-200 rounded-xl p-5">
                  <Icon className="h-7 w-7 text-red-600 mb-4" />
                  <p className="text-sm text-gray-500 mb-1">{label}</p>
                  <p className="font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-7">
              <ShieldCheckIcon className="h-9 w-9 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                How we work
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed mb-5">
                <p>
                  Dalimss News prioritises accuracy, attribution, fairness and
                  public interest. Our articles carry identifiable bylines and
                  clear publication or update dates.
                </p>
                <p>
                  Where appropriate, we explain the basis of our reporting,
                  consult documentary or primary material, seek responses from
                  individuals and organisations named in a story, and distinguish
                  clearly between news, analysis, opinion and sponsored content.
                </p>
                <p>
                  Material factual errors are corrected transparently in
                  accordance with our corrections policy.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link className="text-red-700 font-semibold hover:underline" href="/editorial-policy">
                  Editorial policy
                </Link>
                <Link className="text-red-700 font-semibold hover:underline" href="/corrections-policy">
                  Corrections policy
                </Link>
                <Link className="text-red-700 font-semibold hover:underline" href="/authors">
                  Newsroom and contributors
                </Link>
                <Link className="text-red-700 font-semibold hover:underline" href="/contact">
                  Contact us
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

        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Ownership and leadership
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-7">
              <div className="border border-gray-200 rounded-xl p-6">
                <p className="text-sm text-gray-500 mb-1">Publisher</p>
                <p className="font-semibold text-gray-900">
                  PAMF DIGIMEDIA PRIVATE LIMITED
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6">
                <p className="text-sm text-gray-500 mb-1">
                  Editor-in-Chief
                </p>
                <p className="font-semibold text-gray-900">Saurav Yadav</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-4xl">
              Editorial decisions are taken by the Dalimss News editorial team.
              Advertising, partnerships and sponsored material are identified
              separately and do not determine the conclusions of independent
              news reports.
            </p>
          </div>
        </section>

        <section className="py-14 bg-gray-900 text-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold mb-8">Contact the newsroom</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-300">
              <div>
                <EnvelopeIcon className="h-6 w-6 text-red-500 mb-3" />
                <h3 className="text-white font-semibold mb-2">Email</h3>
                <div className="space-y-2">
                  <p>
                    <span className="block text-sm text-gray-400">
                      News tips and editorial enquiries
                    </span>
                    <a className="hover:text-white" href="mailto:editor@dalimss.news">
                      editor@dalimss.news
                    </a>
                  </p>
                  <p>
                    <span className="block text-sm text-gray-400">
                      General enquiries
                    </span>
                    <a className="hover:text-white" href="mailto:info@dalimss.news">
                      info@dalimss.news
                    </a>
                  </p>
                </div>
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
                <h3 className="text-white font-semibold mb-1">
                  Varanasi newsroom
                </h3>
                <p>Varanasi, Uttar Pradesh, India</p>
              </div>
              <div>
                <MapPinIcon className="h-6 w-6 text-red-500 mb-3" />
                <h3 className="text-white font-semibold mb-1">
                  Gurugram editorial office
                </h3>
                <p>Gurugram, Haryana, India</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
