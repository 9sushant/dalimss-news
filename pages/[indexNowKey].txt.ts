import { GetServerSideProps } from "next";

/**
 * Serves the IndexNow key at https://dalimss.news/<INDEXNOW_KEY>.txt.
 * robots.txt disallows /api/ for crawlers, so the key file stays on the site
 * root. This dynamic .txt route does not replace real pages such as /about.
 * The response is the key alone, or 404 when INDEXNOW_KEY is unset or the
 * requested name does not match it.
 */
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

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.end(key);

  return { props: {} };
};

export default IndexNowKey;
