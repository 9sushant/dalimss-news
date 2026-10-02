import { GetServerSideProps } from "next";
import { buildRssFeed } from "@/lib/rss";

const HindiFeed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rss = await buildRssFeed({
    language: "hi",
    title: "हिंदी समाचार - Dalimss News",
    description:
      "Dalimss News की ताजा हिंदी खबरें: वाराणसी, पूर्वांचल, गुरुग्राम और भारत.",
    selfPath: "/hindi/feed.xml",
    channelPath: "/hindi",
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

export default HindiFeed;
