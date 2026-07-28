import { GetServerSideProps } from "next";

const IndexNowKey = () => null;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const key = process.env.INDEXNOW_KEY;
  const requestedKey = String(params?.indexNowKey || "");

  if (!key || requestedKey !== key) {
    return { notFound: true };
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(key);
  res.end();

  return { props: {} };
};

export default IndexNowKey;
