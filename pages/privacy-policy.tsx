import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  ShieldCheckIcon,
  EyeIcon,
  UserGroupIcon,
  LockClosedIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const sections = [
  {
    id: "information-we-collect",
    icon: EyeIcon,
    title: "Information We Collect",
    content: [
      "We may collect the following types of information when you use our website:",
    ],
    list: [
      "Personal Information: Name, email address, and other details you voluntarily provide when signing in with Google or contacting us.",
      "Usage Data: Pages visited, time spent on pages, browser type, device information, IP address, and referring URLs.",
      "Cookies & Tracking Technologies: We use cookies and similar technologies to enhance your experience, analyze traffic, and serve personalized advertisements.",
    ],
  },
  {
    id: "how-we-use-information",
    icon: DocumentTextIcon,
    title: "How We Use Your Information",
    content: [
      "We use the information we collect for the following purposes:",
    ],
    list: [
      "To provide, maintain, and improve our news services.",
      "To personalize your experience and deliver relevant content.",
      "To communicate with you about updates, news alerts, and editorial content.",
      "To analyze website usage and improve performance.",
      "To display advertisements through third-party ad networks such as Google AdSense.",
      "To comply with legal obligations and enforce our terms.",
    ],
  },
  {
    id: "cookies",
    icon: GlobeAltIcon,
    title: "Cookies & Tracking Technologies",
    content: [
      "Dalimss News uses cookies to enhance your browsing experience. Cookies are small data files stored on your device.",
      "We use the following types of cookies:",
    ],
    list: [
      "Essential Cookies: Required for the website to function properly (e.g., authentication, session management).",
      "Analytics Cookies: Help us understand how visitors interact with our website (e.g., Google Analytics).",
      "Advertising Cookies: Used by third-party ad networks (e.g., Google AdSense) to serve personalized ads based on your browsing history.",
    ],
    afterList:
      "You can manage your cookie preferences through your browser settings. Please note that disabling cookies may affect the functionality of our website.",
  },
  {
    id: "third-party-advertising",
    icon: UserGroupIcon,
    title: "Third-Party Advertising",
    content: [
      "We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use information about your visits to this and other websites to provide advertisements about goods and services of interest to you.",
      "Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet. You may opt out of the use of the DART cookie by visiting the Google Ad and Content Network Privacy Policy.",
    ],
    list: [],
  },
  {
    id: "data-sharing",
    icon: LockClosedIcon,
    title: "Data Sharing & Disclosure",
    content: [
      "We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:",
    ],
    list: [
      "With Service Providers: Third-party services that help us operate our website (e.g., hosting, analytics, advertising).",
      "For Legal Compliance: When required by law, regulation, or legal process.",
      "For Safety: To protect the rights, property, or safety of Dalimss News, our users, or the public.",
    ],
  },
  {
    id: "your-rights",
    icon: ShieldCheckIcon,
    title: "Your Rights",
    content: ["As a user, you have the following rights:"],
    list: [
      "Access: You can request a copy of the personal data we hold about you.",
      "Correction: You can request corrections to any inaccurate personal data.",
      "Deletion: You can request deletion of your personal data, subject to legal obligations.",
      "Opt-Out: You can opt out of personalized advertising by visiting Google's Ads Settings or using the Network Advertising Initiative opt-out page.",
      "Cookie Management: You can manage or delete cookies through your browser settings.",
    ],
  },
  {
    id: "children-privacy",
    icon: UserGroupIcon,
    title: "Children's Privacy",
    content: [
      "Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately, and we will take steps to delete such information.",
    ],
    list: [],
  },
  {
    id: "changes",
    icon: DocumentTextIcon,
    title: "Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated \"Last Updated\" date. We encourage you to review this page periodically to stay informed about how we protect your data.",
    ],
    list: [],
  },
];

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Dalimss News</title>
        <meta
          name="description"
          content="Privacy Policy for Dalimss News - Learn how we collect, use, and protect your personal information. Your privacy is important to us."
        />
        <meta property="og:title" content="Privacy Policy | Dalimss News" />
        <meta
          property="og:description"
          content="Privacy Policy for Dalimss News - Learn how we collect, use, and protect your personal information."
        />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 mb-6">
              <ShieldCheckIcon className="h-5 w-5 text-red-400" />
              <span className="text-sm font-medium text-red-300">
                Privacy Policy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Privacy <span className="text-red-500">Matters to Us</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
              At Dalimss News, we are committed to protecting your privacy and
              ensuring the security of your personal information.
            </p>
            <p className="text-sm text-gray-400">
              Last Updated: February 14, 2026
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
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
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
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

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <EnvelopeIcon className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Questions About Our Privacy Policy?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or your personal data, please don't hesitate to
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
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-red-600/30"
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

export default PrivacyPolicyPage;
