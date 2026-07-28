import { GetServerSideProps } from "next";
import { buildRssFeed } from "@/lib/rss";

const VaranasiFeed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rss = await buildRssFeed({
    categorySlug: "varanasi",
    title: "Varanasi News - Dalimss News",
    description:
      "Latest verified Varanasi, Banaras and Kashi news from Dalimss News.",
    selfPath: "/varanasi/feed.xml",
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

export default VaranasiFeed;
