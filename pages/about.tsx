import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { 
  NewspaperIcon, 
  GlobeAltIcon, 
  UserGroupIcon,
  TrophyIcon,
  SparklesIcon,
  HeartIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";



// Timeline milestones
const milestones = [
  { year: "Jan 2024", title: "Founded", description: "Dalimss News was born with a vision to revolutionize local journalism" },
  { year: "Feb 2024", title: "Digital Launch", description: "Launched our digital platform reaching 100,000 monthly readers" },
  { year: "May 2024", title: "Academy Launch", description: "Started Dalimss Academy to train the next generation of journalists" },
  { year: "Dec 2024", title: "1M+ Readers", description: "Crossed 1 million monthly readers milestone" },
  { year: "Feb 2026", title: "National Recognition", description: "Received national award for excellence in digital journalism" }
];

const AboutPage: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Dalimss News",
    url: "https://dalimss.news",
    logo: {
      "@type": "ImageObject",
      url: "https://dalimss.news/logo-square.png",
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
    sameAs: [
      "https://www.instagram.com/dalimss_news",
      "https://x.com/dalimss_news",
    ],
    ethicsPolicy: "https://dalimss.news/editorial-policy",
    correctionsPolicy: "https://dalimss.news/corrections-policy",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Newsroom",
      telephone: "+91-63927-52976",
      email: "dalimssnews@gmail.com",
    },
  };

  return (
    <>
      <Head>
        <title>About Us | Dalimss News</title>
        <meta name="description" content="Learn about Dalimss News - Varanasi's leading digital news platform. Our mission, team, and commitment to quality journalism." />
        <meta property="og:title" content="About Us | Dalimss News" />
        <meta property="og:description" content="Learn about Dalimss News - Varanasi's leading digital news platform." />
        <link rel="canonical" href="https://dalimss.news/about" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </Head>


        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-28 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 mb-6">
                <NewspaperIcon className="h-5 w-5 text-red-400" />
                <span className="text-sm font-medium text-red-300">About Dalimss News</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Empowering Communities with <span className="text-red-500">Truth & Integrity</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Dalimss News is a premier digital news platform committed to delivering accurate, timely, and unbiased news across Varanasi, Uttar Pradesh, Gurugram, and key national developments.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  With an emphasis on responsible journalism, Dalimss News covers a wide range of topics including civic issues, education, culture, governance, social developments, and public interest stories. The platform aims to amplify local voices while maintaining journalistic integrity and factual reporting.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Through its website and active presence across social media platforms, Dalimss News strives to keep readers informed, aware, and engaged with issues that matter at the grassroots as well as the national level.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed font-semibold italic">
                  Dalimss News — Reporting with responsibility, rooted in the region.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="h-7 w-7 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Excellence</h3>
                  <p className="text-sm text-gray-600">Striving for the highest quality in every story</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="h-7 w-7 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Integrity</h3>
                  <p className="text-sm text-gray-600">Honest, ethical journalism you can trust</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GlobeAltIcon className="h-7 w-7 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Impact</h3>
                  <p className="text-sm text-gray-600">Making a difference in our community</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="h-7 w-7 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Community</h3>
                  <p className="text-sm text-gray-600">Serving the people of Varanasi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">5+</div>
                <div className="text-red-200">Years of Service</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
                <div className="text-red-200">Monthly Readers</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
                <div className="text-red-200">Articles Published</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-red-200">Team Members</div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From humble beginnings to becoming Varanasi's trusted news source
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200 hidden md:block"></div>
                
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                        <div className="inline-block bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Center Dot */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow"></div>
                    
                    {/* Spacer */}
                    <div className="hidden md:block w-5/12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Have a story tip, feedback, or want to collaborate? We'd love to hear from you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors">
                  <div className="w-14 h-14 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPinIcon className="h-7 w-7 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-2">Visit Us</h3>
                  <p className="text-gray-400 text-sm">
                    Varanasi, Uttar Pradesh<br />
                    India - 221001
                  </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors">
                  <div className="w-14 h-14 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <EnvelopeIcon className="h-7 w-7 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-2">Email Us</h3>
                  <p className="text-gray-400 text-sm">
                    dalimssnews@gmail.com
                  </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors">
                  <div className="w-14 h-14 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneIcon className="h-7 w-7 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-2">Grievance Officer</h3>
                  <p className="text-gray-400 text-sm">
                    +91 63927 52976<br />
                    Mon-Sat, 9AM-6PM
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-red-600/30"
                >
                  <NewspaperIcon className="h-5 w-5" />
                  Explore Latest News
                </Link>
              </div>
            </div>
          </div>
        </section>

    </>
  );
};

export default AboutPage;
