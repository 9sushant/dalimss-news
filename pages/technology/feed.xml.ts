import { GetServerSideProps } from "next";
import { buildRssFeed } from "@/lib/rss";

const TechnologyFeed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rss = await buildRssFeed({
    categorySlug: "technology",
    title: "Technology News - Dalimss News",
    description:
      "Latest verified technology, AI, gadgets and digital policy news from Dalimss News.",
    selfPath: "/technology/feed.xml",
  });

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=1200"
  );
  res.write(rss);
  res.end();

  return { props: {} };
};

export default TechnologyFeed;
