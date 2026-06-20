import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  MegaphoneIcon,
  EyeIcon,
  EnvelopeIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const sections = [
  {
    id: "commitment-to-accuracy",
    icon: ShieldCheckIcon,
    title: "Our Commitment to Accuracy",
    content: [
      `Accuracy is the cornerstone of everything we do at ${SITE_NAME}. We strive to get every fact, name, date, and detail right the first time. However, we recognize that errors can occur despite our best efforts.`,
      "When mistakes happen, we believe the right course of action is to correct them quickly, clearly, and transparently. Our readers deserve nothing less.",
    ],
    list: [],
  },
  {
    id: "how-we-handle-corrections",
    icon: WrenchScrewdriverIcon,
    title: "How We Handle Corrections",
    content: [
      "When an error is brought to our attention — by a reader, source, or our own editorial team — we follow a consistent process:",
    ],
    list: [
      "Review: The editorial team reviews the reported issue to verify whether a correction is warranted. This typically happens within 24–48 hours of receiving the report.",
      "Correct: Once confirmed, we update the article with the accurate information immediately.",
      "Document: A correction notice is added to the article, clearly describing what was changed and when. The original error is not hidden — we believe in transparency over perfection.",
      "Notify: If the error significantly affected a person, organization, or the public understanding of an event, we may reach out directly to affected parties.",
    ],
  },
  {
    id: "types-of-corrections",
    icon: TagIcon,
    title: "Types of Corrections",
    content: [
      "We categorize corrections based on their significance to ensure appropriate handling:",
    ],
    list: [
      "Minor Fixes: Spelling errors, grammatical issues, formatting problems, or broken links are fixed without a formal correction notice.",
      "Factual Corrections: Errors in facts, figures, names, dates, or attributions are corrected with a dated notice appended to the article (e.g., \"Correction, June 20, 2026: An earlier version of this article misstated the population of Varanasi. It is approximately 1.2 million, not 2.1 million.\").",
      "Significant Corrections: Errors that materially change the meaning, context, or implication of an article are corrected with a prominent notice at the top of the article. These corrections are also shared on our social media channels if the original article was widely distributed.",
      "Retractions: In rare cases where an article is found to be fundamentally flawed or based on false information, we retract the article entirely. A retraction notice replaces the content, explaining why the article was removed.",
    ],
  },
  {
    id: "how-to-report-an-error",
    icon: MegaphoneIcon,
    title: "How to Report an Error",
    content: [
      "We encourage our readers to alert us if they spot an error in our reporting. You can report an error through any of the following channels:",
    ],
    list: [
      "Email: Send details to dalimssnews@gmail.com with the subject line \"Correction Request\".",
      "Phone: Call us at +91 63927 52976 (Mon–Sat, 9 AM – 6 PM IST).",
      "Contact Form: Use the contact form on our website at dalimss.news/contact.",
    ],
    afterList:
      "When reporting an error, please include: the URL or title of the article, the specific error you've identified, and any supporting evidence or sources. This helps our team review and act on your report efficiently.",
  },
  {
    id: "transparency",
    icon: EyeIcon,
    title: "Transparency",
    content: [
      "We believe that trust is built through transparency. Here is how we ensure our corrections process remains open and accountable:",
    ],
    list: [
      "All significant corrections are permanently visible on the article. We do not silently alter published content.",
      "Our correction notices include the date of the correction and a clear description of what was changed.",
      "Readers can always compare the corrected version with the original context provided in the notice.",
      "We maintain an internal log of all corrections to track patterns, improve our processes, and hold ourselves accountable.",
      "Our editorial team regularly reviews recurring errors to identify systemic issues and implement training or process improvements.",
    ],
    afterList: `We view corrections not as failures but as a demonstration of our commitment to getting the truth right. If you have questions about our corrections process, please don't hesitate to reach out.`,
  },
];

const CorrectionsPolicyPage: React.FC = () => {
  const canonicalUrl = `${SITE_URL}/corrections-policy`;
  const pageTitle = `Corrections Policy | ${SITE_NAME}`;
  const pageDescription = `Learn how ${SITE_NAME} handles corrections and maintains accuracy in its reporting. Our transparent corrections policy ensures accountability to our readers.`;

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
                Corrections Policy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Accuracy is Our{" "}
              <span className="text-red-500">Top Priority</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
              When we make a mistake, we fix it — promptly, clearly, and
              transparently. Here&apos;s how our corrections process works.
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
              <MegaphoneIcon className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Spotted an Error?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Help us maintain accuracy. If you&apos;ve found a factual error in
              our reporting, please let us know and we&apos;ll review it
              promptly.
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
                href="/editorial-policy"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-red-600/30"
              >
                <NewspaperIcon className="h-5 w-5" />
                Editorial Policy
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

export default CorrectionsPolicyPage;
