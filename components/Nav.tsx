
import React from 'react';
// Import the entire module to handle potential default export wrapping from the CDN.
import * as HeroIcons from '@heroicons/react/24/outline';

// Safely access the icon component, ensuring it is a renderable function.
// This prevents React error #31 if the resolved module is an object instead of a component.
const getIcon = (collection: any, iconName: string) => {
    const icon = (collection as any)[iconName] ?? (collection as any).default?.[iconName];
    return typeof icon === 'function' ? icon : null;
}

const PencilSquareIcon = getIcon(HeroIcons, 'PencilSquareIcon');
const MagnifyingGlassIcon = getIcon(HeroIcons, 'MagnifyingGlassIcon');
const BellIcon = getIcon(HeroIcons, 'BellIcon');


const Nav: React.FC = () => {
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href) {
        window.location.hash = href;
    }
  };

  return (
    <header className="bg-black border-b border-slate-800 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <a href="#/" onClick={handleNavClick} className="flex-shrink-0 text-2xl font-bold text-white hover:text-slate-300 transition-colors">
              NextGen
            </a>
            <div className="hidden sm:flex items-center relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-black transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <a href="#/new" onClick={handleNavClick} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              {PencilSquareIcon && <PencilSquareIcon className="h-6 w-6" />}
              <span className="font-medium text-sm hidden md:inline">Write</span>
            </a>
            <button className="text-slate-400 hover:text-white transition-colors p-1 rounded-full">
              {BellIcon && <BellIcon className="h-6 w-6" />}
            </button>
            <button>
              <img 
                src="https://i.imgur.com/6VBx3io.png" // Placeholder avatar
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
              />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
