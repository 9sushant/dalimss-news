import { GetServerSideProps } from "next";
import { buildRssFeed } from "@/lib/rss";

const LifestyleFeed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rss = await buildRssFeed({
    categorySlug: "lifestyle",
    title: "Lifestyle News - Dalimss News",
    description:
      "Lifestyle from Gurugram and across India: restaurants and cafes, fitness and wellness, shopping, events and everyday city guides.",
    selfPath: "/lifestyle/feed.xml",
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

export default LifestyleFeed;
