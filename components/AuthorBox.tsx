import type { AuthorBoxProfile } from "@/lib/authorBoxes";

interface AuthorBoxProps {
  author: AuthorBoxProfile;
}

export function AuthorBox({ author }: AuthorBoxProps) {
  return (
    <section className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 sm:px-5">
      <h2 className="mb-4 text-base font-bold text-gray-900">About the author</h2>
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <img
          src={author.photoUrl}
          alt={author.photoAlt}
          width={80}
          height={80}
          loading="lazy"
          className="h-20 w-20 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 text-sm leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-900">{author.name}</p>
          <p className="mb-2 text-gray-600">
            {author.jobTitle}, {author.organizationName}
          </p>
          <p>{author.bio}</p>
        </div>
      </div>
    </section>
  );
}
