import { GetServerSideProps } from "next";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { authorSlug, canonicalAuthorName } from "@/lib/seo";

interface AuthorProfileForm {
  name: string;
  bio: string;
  beat: string;
  experience: string;
  imageUrl: string;
  professionalUrl: string;
  email: string;
}

interface Props {
  slug: string;
  initialProfile: AuthorProfileForm;
}

export default function EditAuthorProfile({
  slug,
  initialProfile,
}: Props) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (field: keyof AuthorProfileForm, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  if (status === "loading") {
    return <p className="mx-auto max-w-3xl px-6 py-16">Loading…</p>;
  }

  if (
    !session?.user ||
    !["admin", "editor"].includes(session.user.role || "")
  ) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="mb-5">An editor or administrator account is required.</p>
        <button
          type="button"
          onClick={() => signIn()}
          className="rounded bg-red-600 px-5 py-2 text-white"
        >
          Sign in
        </button>
      </div>
    );
  }

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/authors/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save profile");
      setMessage("Author profile saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit {profile.name} | Dalimss News</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              Newsroom CMS
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit author profile
            </h1>
          </div>
          <Link
            href={`/author/${slug}`}
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            View public profile
          </Link>
        </div>

        <form onSubmit={saveProfile} className="space-y-6">
          <Field
            label="Public name"
            value={profile.name}
            onChange={(value) => updateField("name", value)}
            required
          />
          <TextArea
            label="Biography"
            hint="Use factual career information that the contributor has approved."
            value={profile.bio}
            onChange={(value) => updateField("bio", value)}
          />
          <Field
            label="Reporting beat"
            value={profile.beat}
            onChange={(value) => updateField("beat", value)}
            placeholder="For example: Varanasi civic affairs and education"
          />
          <TextArea
            label="Experience"
            hint="State verifiable roles, qualifications or years of relevant experience."
            value={profile.experience}
            onChange={(value) => updateField("experience", value)}
          />
          <Field
            label="Photograph URL"
            type="url"
            value={profile.imageUrl}
            onChange={(value) => updateField("imageUrl", value)}
          />
          <Field
            label="Professional profile URL"
            type="url"
            value={profile.professionalUrl}
            onChange={(value) => updateField("professionalUrl", value)}
            placeholder="LinkedIn, portfolio or professional organisation profile"
          />
          <Field
            label="Public contact or newsroom email"
            type="email"
            value={profile.email}
            onChange={(value) => updateField("email", value)}
          />

          {message && (
            <p className="rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save verified profile"}
          </button>
        </form>
      </main>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded border border-gray-300 px-3 py-2"
      />
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full rounded border border-gray-300 px-3 py-2"
      />
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const slug = authorSlug(String(params?.slug || ""));
  const existing = await prisma.authorProfile.findUnique({ where: { slug } });
  const name = canonicalAuthorName(
    existing?.name ||
      slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
  );

  return {
    props: {
      slug,
      initialProfile: {
        name,
        bio: existing?.bio || "",
        beat: existing?.beat || "",
        experience: existing?.experience || "",
        imageUrl: existing?.imageUrl || "",
        professionalUrl: existing?.professionalUrl || "",
        email: existing?.email || "",
      },
    },
  };
};
