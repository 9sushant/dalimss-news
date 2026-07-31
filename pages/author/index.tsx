import { GetServerSideProps } from "next";

export default function AuthorDirectoryRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/authors",
    permanent: true,
  },
});
