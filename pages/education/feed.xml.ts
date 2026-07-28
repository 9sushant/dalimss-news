import { GetServerSideProps } from "next";
import { buildRssFeed } from "@/lib/rss";

const EducationFeed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rss = await buildRssFeed({
    categorySlug: "education",
    title: "Education News - Dalimss News",
    description:
      "Latest verified education, admissions, exams and campus news from Dalimss News.",
    selfPath: "/education/feed.xml",
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

export default EducationFeed;
