import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  UserCircleIcon,
  BellIcon
} from "@heroicons/react/24/outline";

import { NAV_CATEGORIES } from "@/lib/categories";

const Nav: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  // Close mobile menu on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Sync search input with URL
  React.useEffect(() => {
    if (router.query.search) {
      setSearchQuery(String(router.query.search));
    } else {
      setSearchQuery("");
    }
  }, [router.query.search]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    } else if (router.query.search) {
      router.push("/");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="flex flex-col bg-white border-b border-gray-200 sticky top-0 z-50 font-sans">
      {/* Top Utility Bar */}
      <div className="hidden md:flex justify-between items-center px-4 lg:px-8 py-1 bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
        <div className="flex gap-4">
          <span>{currentDate}</span>
        </div>
        <div className="flex gap-4">
          {/* Reserved for future links */}
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
             <Image 
               src="/logo.png" 
               alt="Dalimss News" 
               width={180} 
               height={60} 
               className="h-10 md:h-14 w-auto object-contain"
               priority
             />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Desktop Search & Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search news..." 
                className="pl-3 pr-10 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-red-600 w-64 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <MagnifyingGlassIcon 
                className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-red-600" 
                onClick={handleSearch}
              />
            </div>

            <div className="flex items-center gap-4">


              {!session ? (
                <button 
                  onClick={() => signIn()} 
                  className="text-sm font-semibold text-gray-700 hover:text-red-600 flex items-center gap-1"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  Sign In
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-200"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-700" />
                  )}
                  <button 
                    onClick={() => signOut()} 
                    className="text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 px-2 py-1 rounded"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={`md:block ${isMenuOpen ? 'block' : 'hidden'} border-t border-gray-100 bg-white`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-col md:flex-row md:items-center md:justify-center gap-1 md:gap-6 py-2 text-sm font-bold text-gray-800 uppercase tracking-wide">
            <li>
              <Link href="/" className="block py-2 md:py-0 hover:text-[#E21B22] transition-colors">
                Home
              </Link>
            </li>
            {NAV_CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`} className="block py-2 md:py-0 hover:text-[#E21B22] transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/courses" className="block py-2 md:py-0 hover:text-[#E21B22] transition-colors">
                Courses
              </Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 md:py-0 hover:text-[#E21B22] transition-colors">
                About
              </Link>
            </li>
            {session && session.user && (session.user.role === "admin" || session.user.role === "editor" || session.user.email === "admin@dalimss.com" || session.user.email === "sushantgaurav@dalimss.com" || session.user.email === "dalimsssushant@gmail.com") && (
               <li>
                <Link 
                  href="/articles/new" 
                  className="block py-2 md:py-0 text-[#E21B22] hover:text-red-700 transition-colors"
                >
                  Write Article
                </Link>
              </li>
            )}
            {/* Mobile Auth Buttons */}
            <li className="md:hidden border-t border-gray-100 mt-2 pt-2">
              {!session ? (
                <button 
                  onClick={() => signIn()} 
                  className="block w-full text-left py-2 text-gray-700 hover:text-red-600"
                >
                  Sign In
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 py-2 text-gray-600">
                      {session.user?.image && (
                        <Image src={session.user.image} width={24} height={24} className="rounded-full" alt="" />
                      )}
                      <span className="text-xs normal-case font-normal">{session.user?.name} {(session.user?.role === "admin" || session.user?.email === "sushantgaurav@dalimss.com" || session.user?.email === "dalimsssushant@gmail.com") && "(Admin)"}</span>
                   </div>
                   <button 
                    onClick={() => signOut()} 
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
