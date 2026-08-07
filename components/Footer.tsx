import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/categories";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800 mt-16 py-12 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
          {/* Column 1: Branding */}
          <div className="space-y-4">
            <h3 className="text-white font-serif text-xl font-bold tracking-tight">
              Dalimss <span className="text-red-500">News</span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Dalimss News is a digital news publication covering Varanasi,
              Eastern Uttar Pradesh, Gurugram, Delhi-NCR and major developments
              from across India.
            </p>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
              Original reporting. Clear attribution. Journalism in the public interest.
            </p>
          </div>

          {/* Column 2: Categories */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              News Categories
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-left">
              <Link
                href="/ott"
                className="font-semibold text-red-400 transition-colors hover:text-white"
              >
                OTT
              </Link>
              {NAV_CATEGORIES.slice(0, 10).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Trust & Policies */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              Policies & Trust
            </h4>
            <ul className="space-y-2 text-sm flex flex-col text-left">
              <Link href="/editorial-policy" className="text-gray-400 hover:text-white transition-colors">
                Editorial Policy
              </Link>
              <Link href="/corrections-policy" className="text-gray-400 hover:text-white transition-colors">
                Corrections Policy
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/authors" className="text-gray-400 hover:text-white transition-colors">
                Newsroom & Contributors
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link href="/ott/feed.xml" className="text-gray-400 hover:text-white transition-colors">
                OTT RSS Feed
              </Link>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <a
                href="https://google.com/preferences/source?q=dalimss.news"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Make us a preferred source on Google
              </a>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* Bottom Utility / Copyright & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Dalimss News. All rights reserved.
          </p>

          <div className="flex gap-4">
            <Link 
              href="https://www.instagram.com/dalimss.news.banaras/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#E1306C] transition-colors"
              aria-label="Instagram"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="feather feather-instagram"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>

            <Link 
              href="https://www.youtube.com/@dalimss_news" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#FF0000] transition-colors"
              aria-label="YouTube"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="feather feather-youtube"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
