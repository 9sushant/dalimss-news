import React from 'react';
import ArticleCard from '../components/ArticleCard';
import { Article } from '../types';
// Import the entire module to handle potential default export wrapping from the CDN.
import * as HeroIcons from '@heroicons/react/24/outline';

// Safely access the icon component, ensuring it is a renderable function.
// This prevents React error #31 if the resolved module is an object instead of a component.
const DocumentPlusIconComponent = (HeroIcons as any).DocumentPlusIcon ?? (HeroIcons as any).default?.DocumentPlusIcon;
const DocumentPlusIcon = typeof DocumentPlusIconComponent === 'function' ? DocumentPlusIconComponent : null;

interface HomeProps {
  articles: Article[];
}

const HomePage: React.FC<HomeProps> = ({ articles }) => {
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href) {
        window.location.hash = href;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {articles.length > 0 ? (
        <div>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4">
          {DocumentPlusIcon && <DocumentPlusIcon className="mx-auto h-16 w-16 text-slate-400" />}
          <h3 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Your feed is empty</h3>
          <p className="mt-2 text-slate-500">Be the first to publish a story on NextGen News.</p>
          <div className="mt-6">
            <a href="#/new" onClick={handleNavClick} className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-slate-900 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all">
              Start Writing
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;