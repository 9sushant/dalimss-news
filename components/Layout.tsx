import Nav from "@/components/Nav";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="bg-white min-h-screen text-gray-900 font-sans">
    <Nav />
    <main>{children}</main>
  </div>
);

export default Layout;
