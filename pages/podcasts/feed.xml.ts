import { GetServerSideProps } from "next";
import { buildPodcastFeed } from "@/lib/podcastFeed";

const PodcastFeed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const feed = await buildPodcastFeed();

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=1200"
  );
  res.write(feed);
  res.end();

  return { props: {} };
};

export default PodcastFeed;
