import Nav from "@/components/Nav";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="bg-black min-h-screen text-white">
    <Nav />
    <main className="container mx-auto px-6 py-10">{children}</main>
  </div>
);

export default Layout;
