import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import HomePage from './pages/index';
import NewArticlePage from './pages/articles/new';
import ArticlePage from './pages/articles/[slug]';
import type { Article } from './types';
import slugify from 'slugify';

// This file was empty and is now the main entrypoint for the SPA.

const initialArticles: Article[] = [
    {
        id: 1,
        title: 'The AI Bubble Is About To Burst, But The Next Bubble Is Already Growing',
        slug: 'the-ai-bubble-is-about-to-burst',
        content: 'Techbros are preparing their latest bandwagon. For the last two weeks, the UI for AI team has been working on generating concepts that solve the various issues with current AI systems. This is a collection of ideas and explorations.',
        mediaUrl: 'https://i.imgur.com/v82a2gG.png',
        mediaType: 'image',
        createdAt: new Date('2023-09-15T12:00:00Z').toISOString(),
        authorName: 'Will Lockett',
        authorAvatarUrl: 'https://i.imgur.com/Ock21xr.jpeg',
        readTimeInMinutes: 7,
        claps: 16700,
        commentsCount: 595,
    },
    {
        id: 2,
        title: 'UI for AI Initial Concepts',
        slug: 'ui-for-ai-initial-concepts',
        content: 'For the last two weeks, the UI for AI team has been working on generating concepts that solve the various issues with current AI systems. This is a collection of ideas and explorations. As you’ll see, these are sketches, designed to convey an idea in a rough but understandable way.',
        mediaUrl: 'https://i.imgur.com/h5z0nN8.png',
        mediaType: 'image',
        createdAt: new Date('2023-10-13T12:00:00Z').toISOString(),
        authorName: 'Dan Saffer',
        authorAvatarUrl: 'https://i.imgur.com/5D4e5SA.jpeg',
        publicationName: 'UI for AI',
        readTimeInMinutes: 5,
        claps: 366,
        commentsCount: 10,
    },
    {
        id: 3,
        title: 'Remember Vibe Coders? Yeah… They’re Gone',
        slug: 'remember-vibe-coders',
        content: 'Turns out it was the first AI bubble to burst. As you’ll see, these are sketches, designed to convey an idea in a rough but understandable way. Every concept has a user problem it was focused on improving. Some of these concepts—indeed, many of them—overlap.',
        mediaUrl: 'https://i.imgur.com/KqYqg1a.png',
        mediaType: 'image',
        createdAt: new Date('2023-10-19T12:00:00Z').toISOString(),
        authorName: 'Adarsh Gupta',
        authorAvatarUrl: 'https://i.imgur.com/bV25p1d.png',
        publicationName: 'Write A Catalyst',
        readTimeInMinutes: 4,
        claps: 5800,
        commentsCount: 195,
    },
];

const App = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [route, setRoute] = useState(window.location.hash || '#/');

    // Load articles from localStorage on initial render
    useEffect(() => {
        try {
            const savedArticles = localStorage.getItem('articles');
            if (savedArticles && JSON.parse(savedArticles).length > 0) {
                setArticles(JSON.parse(savedArticles));
            } else {
                setArticles(initialArticles);
            }
        } catch (e) {
            console.error("Failed to parse articles from localStorage", e);
            setArticles(initialArticles);
        }
    }, []);

    // Save articles to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('articles', JSON.stringify(articles));
        } catch (e) {
            console.error("Failed to save articles to localStorage", e);
        }
    }, [articles]);

    // Handle routing via hash changes
    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash || '#/');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleAddArticle = (newArticleData: Omit<Article, 'id' | 'slug' | 'createdAt' | 'authorName' | 'authorAvatarUrl' | 'readTimeInMinutes' | 'claps' | 'commentsCount'>) => {
        const baseSlug = slugify(newArticleData.title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;
        // Ensure slug is unique
        while (articles.some(a => a.slug === slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const newArticle: Article = {
            ...newArticleData,
            id: Date.now(),
            slug,
            createdAt: new Date().toISOString(),
            // Add default values for new fields
            authorName: 'Guest User', // Placeholder author
            authorAvatarUrl: 'https://i.imgur.com/6VBx3io.png', // Placeholder avatar
            readTimeInMinutes: Math.ceil(newArticleData.content.split(' ').length / 200), // Estimate read time
            claps: 0,
            commentsCount: 0,
        };
        const updatedArticles = [newArticle, ...articles];
        setArticles(updatedArticles);
        window.location.hash = `#/articles/${slug}`;
    };

    const renderPage = () => {
        const path = route.replace(/^#/, '');

        if (path.startsWith('/articles/')) {
            const slug = path.split('/')[2];
            const article = articles.find(a => a.slug === slug);
            return article ? <ArticlePage article={article} /> : <div className="text-center p-8">Article not found.</div>;
        } else if (path === '/new') {
            return <NewArticlePage onAddArticle={handleAddArticle} />;
        } else if (path === '/' || path === '') {
            return <HomePage articles={articles} />;
        } else {
            return <div className="text-center p-8 text-xl">404 - Page Not Found</div>;
        }
    };

    return (
        <Layout>
            {renderPage()}
        </Layout>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<React.StrictMode><App /></React.StrictMode>);
}