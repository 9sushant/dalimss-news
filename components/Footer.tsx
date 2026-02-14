import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-8">
      <div className="container mx-auto px-4 text-center">
        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
          <Link href="/about" className="text-gray-600 hover:text-red-600 transition-colors">
            About Us
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/contact" className="text-gray-600 hover:text-red-600 transition-colors">
            Contact Us
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/privacy-policy" className="text-gray-600 hover:text-red-600 transition-colors">
            Privacy Policy
          </Link>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Copyright © 2026 Dalimss News . All rights reserved.
        </p>

        <div className="flex flex-col items-center">
          <h3 className="text-gray-900 font-bold mb-4">Follow Us On</h3>
          <div className="flex gap-4">
            <Link 
              href="https://www.instagram.com/dalimss.news.banaras/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#E1306C] transition-colors"
              aria-label="Instagram"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
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
              className="text-gray-600 hover:text-[#FF0000] transition-colors"
              aria-label="YouTube"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
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
