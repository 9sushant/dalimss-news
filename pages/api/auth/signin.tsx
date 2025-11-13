import { getProviders, signIn } from "next-auth/react";

export default function SignInPage({ providers }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Login to Dalimss News</h1>

      {/* 🔥 FIX: Only render if providers exist */}
      {providers
        ? Object.values(providers).map((provider: any) => (
            <div key={provider.name} className="mb-4">
              <button
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                className="bg-blue-600 px-6 py-2 rounded"
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))
        : <p>No providers found. Check NextAuth configuration.</p>}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders(); // ← IMPORTANT

  return {
    props: { providers },
  };
}
