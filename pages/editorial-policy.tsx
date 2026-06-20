import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  ShieldCheckIcon,
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  CpuChipIcon,
  EnvelopeIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const sections = [
  {
    id: "our-commitment",
    icon: ShieldCheckIcon,
    title: "Our Commitment",
    content: [
      `${SITE_NAME} is committed to producing journalism that is accurate, fair, and independent. We believe our readers deserve truthful reporting that helps them understand the world around them.`,
      "Our editorial team operates independently from our business operations. Advertising, sponsorship, or commercial relationships do not influence our news coverage or editorial decisions.",
    ],
    list: [],
  },
  {
    id: "editorial-standards",
    icon: DocumentCheckIcon,
    title: "Editorial Standards",
    content: [
      "Every piece of content published on our platform adheres to the following standards:",
    ],
    list: [
      "Accuracy: We verify facts before publication. Claims are cross-checked with multiple sources. Statistics and data points are attributed to their original source.",
      "Fairness: We present multiple perspectives on contentious issues. Affected parties are given an opportunity to respond before publication.",
      "Independence: Our editorial decisions are not influenced by advertisers, political parties, or any external pressure. We disclose potential conflicts of interest.",
      "Transparency: We are open about our methods, sources (when possible), and any limitations of our reporting. We clearly label opinion, analysis, and sponsored content.",
      "Accountability: We take responsibility for our work and promptly correct errors when they are identified.",
    ],
  },
  {
    id: "source-requirements",
    icon: MagnifyingGlassIcon,
    title: "Source Requirements",
    content: [
      "Credible sourcing is the foundation of reliable journalism. Our reporters follow strict guidelines when sourcing information:",
    ],
    list: [
      "Primary Sources: We prioritize first-hand accounts, official documents, and direct statements over secondary reporting.",
      "Multiple Sources: Significant claims require verification from at least two independent sources before publication.",
      "Anonymous Sources: We use anonymous sources sparingly and only when the information is of significant public interest and cannot be obtained any other way. Anonymous sources are verified by at least one editor.",
      "Official Data: Government data, court records, and institutional reports are sourced directly from the issuing authority whenever possible.",
      "Attribution: All quotes, data, and claims are attributed to their source. We do not present others' work as our own.",
    ],
  },
  {
    id: "corrections-policy",
    icon: PencilSquareIcon,
    title: "Corrections Policy",
    content: [
      "We take errors seriously. When we make a mistake, we correct it promptly and transparently.",
    ],
    list: [
      "Minor corrections (spelling, grammar, formatting) are made without a notice.",
      "Factual corrections are noted at the bottom of the article with the date of correction and a description of what was changed.",
      "Significant corrections that affect the meaning or interpretation of an article are noted prominently at the top of the article.",
      "If an entire article is found to be substantially inaccurate, we will retract it with an explanation.",
    ],
    afterList:
      "To report an error, please email us at dalimssnews@gmail.com with the article URL and a description of the issue. We review all reports within 48 hours.",
  },
  {
    id: "ai-usage-policy",
    icon: CpuChipIcon,
    title: "AI Usage Policy",
    content: [
      `${SITE_NAME} may use artificial intelligence tools to assist in certain aspects of content creation and newsroom operations. We are transparent about how AI is used:`,
    ],
    list: [
      "AI may be used to assist with research, data analysis, content drafting, and headline suggestions.",
      "All AI-generated or AI-assisted content is reviewed, fact-checked, and edited by human journalists before publication.",
      "AI is never used as the sole author of a news report. A human journalist is always accountable for every published piece.",
      "We do not use AI to fabricate quotes, create fake images, or generate misleading content.",
      "Our AI usage practices are regularly reviewed and updated as the technology evolves.",
    ],
  },
  {
    id: "contact",
    icon: EnvelopeIcon,
    title: "Contact Our Editorial Team",
    content: [
      "We welcome feedback, story tips, and questions about our editorial practices. Reach out to our editorial team:",
    ],
    list: [
      "Email: dalimssnews@gmail.com",
      "Phone: +91 63927 52976 (Mon–Sat, 9 AM – 6 PM IST)",
      "Address: Varanasi, Uttar Pradesh, India – 221001",
    ],
    afterList:
      "For corrections and factual disputes, please include the article URL and specific details about the concern. We aim to respond to all editorial inquiries within 48 hours.",
  },
];

const EditorialPolicyPage: React.FC = () => {
  const canonicalUrl = `${SITE_URL}/editorial-policy`;
  const pageTitle = `Editorial Policy | ${SITE_NAME}`;
  const pageDescription = `Read the editorial policy of ${SITE_NAME}. Learn about our commitment to accuracy, fairness, independence, and transparent journalism.`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@dalimss_news" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 mb-6">
              <NewspaperIcon className="h-5 w-5 text-red-400" />
              <span className="text-sm font-medium text-red-300">
                Editorial Policy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Our Commitment to{" "}
              <span className="text-red-500">Responsible Journalism</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
              At {SITE_NAME}, we uphold the highest standards of accuracy,
              fairness, and independence in every story we publish.
            </p>
            <p className="text-sm text-gray-400">
              Last Updated: June 20, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Quick Navigation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors py-1"
                >
                  → {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                        Section {index + 1}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="ml-0 md:ml-16 space-y-4">
                    {section.content.map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-gray-600 text-lg leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}

                    {section.list && section.list.length > 0 && (
                      <ul className="space-y-3 mt-4">
                        {section.list.map((item, lIdx) => (
                          <li key={lIdx} className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-600 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.afterList && (
                      <p className="text-gray-600 text-lg leading-relaxed mt-4">
                        {section.afterList}
                      </p>
                    )}
                  </div>

                  {index < sections.length - 1 && (
                    <hr className="mt-12 border-gray-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <EnvelopeIcon className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have Concerns About Our Reporting?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              We take every concern seriously. If you believe we have made an
              error or have feedback about our editorial standards, please
              contact us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="bg-gray-800 rounded-xl px-6 py-4 hover:bg-gray-700 transition-colors">
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="font-semibold text-white">
                  dalimssnews@gmail.com
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl px-6 py-4 hover:bg-gray-700 transition-colors">
                <p className="text-sm text-gray-400 mb-1">Phone</p>
                <p className="font-semibold text-white">+91 63927 52976</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/corrections-policy"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-red-600/30"
              >
                <PencilSquareIcon className="h-5 w-5" />
                Corrections Policy
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                <EnvelopeIcon className="h-5 w-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditorialPolicyPage;
