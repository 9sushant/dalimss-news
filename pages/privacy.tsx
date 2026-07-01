import { GetServerSideProps } from "next";

// This page redirects /privacy to /privacy-policy
// Required for Google Play Store policy compliance
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/privacy-policy",
      permanent: true, // 301 redirect
    },
  };
};

export default function Privacy() {
  return null;
}
