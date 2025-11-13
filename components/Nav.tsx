import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const Nav: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-black border-b border-slate-800 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            Dalimss News
          </Link>

          {/* Center link */}
          <Link href="/articles" className="text-slate-300 hover:text-white">
            All Articles
          </Link>

          <div className="flex items-center gap-5">

            {/* Write */}
            {session && (
              <Link href="/articles/new" className="flex items-center gap-2 text-slate-300 hover:text-white">
                <PencilSquareIcon className="h-6 w-6" />
                Write
              </Link>
            )}

            {/* Sign In / Out */}
            {!session ? (
              <button onClick={() => signIn("google")} className="text-blue-400">
                Sign In
              </button>
            ) : (
              <>
                <button onClick={() => signOut()} className="text-red-400">
                  Sign Out
                </button>

                {/* Profile Image */}
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="rounded-full border border-slate-600"
                  />
                )}
              </>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
};

export default Nav;
