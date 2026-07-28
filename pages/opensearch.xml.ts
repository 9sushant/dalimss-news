import { GetServerSideProps } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { xmlEscape } from "@/lib/xml";

const OpenSearch = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${xmlEscape(SITE_NAME)}</ShortName>
  <Description>Search verified reports from ${xmlEscape(SITE_NAME)}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image height="32" width="32" type="image/png">${SITE_URL}/favicon.png</Image>
  <Url type="text/html" template="${SITE_URL}/?search={searchTerms}" />
</OpenSearchDescription>`;

  res.setHeader("Content-Type", "application/opensearchdescription+xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default OpenSearch;
