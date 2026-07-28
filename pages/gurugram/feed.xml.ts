import { GetServerSideProps } from "next";
import { buildRssFeed } from "@/lib/rss";

const GurugramFeed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rss = await buildRssFeed({
    categorySlug: "gurgaon",
    title: "Gurugram News - Dalimss News",
    description:
      "Latest verified Gurugram and Gurgaon news from Dalimss News.",
    selfPath: "/gurugram/feed.xml",
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

export default GurugramFeed;
