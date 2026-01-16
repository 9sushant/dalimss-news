import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Head from "next/head";
import { ReactElement } from "react";
import Link from "next/link";
// Define custom element types for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'amp-story': any;
      'amp-story-page': any;
      'amp-story-grid-layer': any;
      'amp-story-cta-layer': any;
      'amp-img': any;
      'amp-video': any;
    }
  }
}

export const config = { unstable_runtimeJS: false };

interface StoryPage {
  id: number;
  imageUrl: string;
  heading: string | null;
  text: string | null;
  order: number;
}

interface WebStory {
  id: number;
  slug: string;
  title: string;
  coverImage: string;
  createdAt: string;
  pages: StoryPage[];
}

interface Props {
  story: WebStory | null;
}

export default function WebStoryPage({ story }: Props) {
  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Story not found</h1>
          <a href="/" className="text-red-500 hover:underline">Go Home</a>
        </div>
      </div>
    );
  }

  const publisherLogoSrc = "https://dalimss.news/logo.png"; 

  // Format date to ISO string for metadata if needed
  const datePublished = new Date(story.createdAt).toISOString();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <title>{story.title}</title>
        <link rel="canonical" href={`https://dalimss.news/stories/${story.slug}`} />
        
        {/* AMP Boilerplate */}
        <style amp-boilerplate="" dangerouslySetInnerHTML={{ __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}` }} />
        <noscript dangerouslySetInnerHTML={{ __html: `<style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style>` }} />

        {/* Required Scripts for Web Stories */}
        <script async key="amp-story" custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" />
        
        {/* Schema.org for Web Stories */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://dalimss.news/stories/${story.slug}`
              },
              "headline": story.title,
              "image": story.pages.map(p => p.imageUrl),
              "datePublished": datePublished,
              "dateModified": datePublished,
              "author": {
                "@type": "Organization",
                "name": "Dalimss News"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Dalimss News",
                "logo": {
                  "@type": "ImageObject",
                  "url": publisherLogoSrc
                }
              }
            })
          }}
        />
        <style amp-custom="" dangerouslySetInnerHTML={{ __html: `
        amp-story {
          font-family: 'Roboto', sans-serif;
          color: #fff;
        }
        amp-story-page {
          background-color: #000;
        }
        .bottom-align {
          align-content: end;
          padding: 0;
        }
        .gradient-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0));
          z-index: 1;
        }
        .content-wrapper {
          position: relative;
          z-index: 2;
          padding: 32px 24px 48px;
        }
        .title {
          font-weight: 800;
          font-size: 2.5em;
          line-height: 1.1;
          margin-bottom: 16px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .tap-to-read {
          font-size: 1em;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .heading {
          font-weight: 700;
          font-size: 1.8em;
          margin-bottom: 12px;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
          line-height: 1.2;
        }
        .text {
          font-size: 1.1em;
          line-height: 1.5;
          opacity: 0.95;
          background: rgba(0,0,0,0.3);
          padding: 12px;
          border-radius: 8px;
          backdrop-filter: blur(4px);
        }
        .cta-container {
            position: absolute;
            bottom: 40px;
            width: 100%;
            display: flex;
            justify-content: center;
        }
        .cta-button {
            background-color: #ef4444; /* Red 500 */
            color: white;
            padding: 12px 32px;
            border-radius: 99px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.1em;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            text-transform: uppercase;
        }
        `}} />
      </Head>

      {/* AMP Story Component */}
      <amp-story
        standalone=""
        title={story.title}
        publisher="Dalimss News"
        publisher-logo-src={publisherLogoSrc}
        poster-portrait-src={story.coverImage}
      >
        {/* Cover Page */}
        <amp-story-page id="cover" auto-advance-after="7s">
          <amp-story-grid-layer template="fill">
            <amp-img 
              src={story.coverImage} 
              width="720" 
              height="1280" 
              layout="responsive"
              alt={story.title}
            />
          </amp-story-grid-layer>
          <amp-story-grid-layer template="vertical" className="bottom-align">
             <div className="gradient-overlay"></div>
             <div className="content-wrapper">
                <h1 className="title">{story.title}</h1>
                <p className="tap-to-read">Tap to read more</p>
             </div>
          </amp-story-grid-layer>
        </amp-story-page>

        {/* Story Pages */}
        {story.pages.map((page, index) => (
          <amp-story-page key={page.id} id={`page-${index + 1}`} auto-advance-after="10s">
            {/* Background Image */}
            <amp-story-grid-layer template="fill">
              <amp-img
                src={page.imageUrl}
                width="720"
                height="1280"
                layout="responsive"
                alt={page.heading || ""}
                animate-in="zoom-out"
                scale-start="1.1" 
                scale-end="1"
              />
            </amp-story-grid-layer>

            {/* Content Layer */}
            <amp-story-grid-layer template="vertical" className="bottom-align">
               <div className="gradient-overlay"></div>
               <div className="content-wrapper">
                  {page.heading && (
                    <h2 className="heading" animate-in="fly-in-bottom">{page.heading}</h2>
                  )}
                  {page.text && (
                    <p className="text" animate-in="fade-in" animate-in-delay="0.3s">{page.text}</p>
                  )}
               </div>
            </amp-story-grid-layer>

             {/* Last Page Call to Action */}
             {index === story.pages.length - 1 && (
                 <amp-story-cta-layer>
                    <div className="cta-container">
                        <a href="/" className="cta-button">Read More News</a>
                    </div>
                 </amp-story-cta-layer>
             )}
          </amp-story-page>
        ))}
      </amp-story>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = String(params?.slug || "");

  try {
    const story = await (prisma as any).webStory.findUnique({
      where: { slug },
      include: { pages: { orderBy: { order: "asc" } } },
    });

    if (!story) {
      return { props: { story: null } };
    }

    return {
      props: {
        story: JSON.parse(JSON.stringify(story)),
      },
    };
  } catch (err) {
    console.error("Story fetch error:", err);
    return { props: { story: null } };
  }
};

