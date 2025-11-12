import React from "react";
import Link from "next/link";
import { PencilSquareIcon, MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";

const Nav: React.FC = () => {
  return (
    <header className="bg-black border-b border-slate-800 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-slate-300 transition-colors">
            Dalimss News
          </Link>

          {/* Nav Links (NEW ADDED ✅) */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/articles" className="text-slate-300 hover:text-white transition">
              All Articles
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center relative">
            <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-slate-900 border border-slate-700 rounded-md pl-10 pr-4 py-2 text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-black transition-colors text-white"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* Write Button */}
            <Link href="/articles/new" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <PencilSquareIcon className="h-6 w-6" />
              <span className="font-medium text-sm hidden md:inline">Write</span>
            </Link>

            {/* Notification
            <button className="text-slate-400 hover:text-white transition-colors p-1 rounded-full">
              <BellIcon className="h-6 w-6" />
            </button> */}

            {/* Avatar */}
            {/* <Link href="/profile">
              <img
                src="https://i.imgur.com/6VBx3io.png"
                alt="User Avatar"
                className="h-8 w-8 rounded-full cursor-pointer"
              />
            </Link> */}

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
