import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";
import {
  authorSlug,
  canonicalAuthorName,
  stripForMeta,
} from "@/lib/seo";

function optionalUrl(value: unknown): string | null {
  const text = String(value || "").trim();
  if (!text) return null;

  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = authorSlug(String(req.query.slug || ""));

  if (req.method === "GET") {
    const profile = await prisma.authorProfile.findUnique({ where: { slug } });
    return profile
      ? res.status(200).json(profile)
      : res.status(404).json({ error: "Author profile not found" });
  }

  if (req.method !== "PUT") {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (
    !session?.user ||
    !["admin", "editor"].includes(session.user.role || "")
  ) {
    return res.status(403).json({ error: "Admins or editors only" });
  }

  const {
    name,
    bio,
    beat,
    experience,
    imageUrl,
    professionalUrl,
    email,
  } = req.body;
  const canonicalName = canonicalAuthorName(String(name || ""));

  if (canonicalName.length < 2 || authorSlug(canonicalName) !== slug) {
    return res.status(400).json({
      error: "Profile name must match the author URL",
    });
  }

  const cleanedImageUrl = optionalUrl(imageUrl);
  const cleanedProfessionalUrl = optionalUrl(professionalUrl);
  if (imageUrl && !cleanedImageUrl) {
    return res.status(400).json({ error: "Photograph URL is invalid" });
  }
  if (professionalUrl && !cleanedProfessionalUrl) {
    return res.status(400).json({ error: "Professional profile URL is invalid" });
  }

  const cleanedEmail = String(email || "").trim().toLowerCase() || null;
  if (
    cleanedEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)
  ) {
    return res.status(400).json({ error: "Email address is invalid" });
  }

  const profile = await prisma.authorProfile.upsert({
    where: { slug },
    create: {
      slug,
      name: canonicalName,
      bio: stripForMeta(String(bio || ""), 600) || null,
      beat: stripForMeta(String(beat || ""), 160) || null,
      experience: stripForMeta(String(experience || ""), 300) || null,
      imageUrl: cleanedImageUrl,
      professionalUrl: cleanedProfessionalUrl,
      email: cleanedEmail,
    },
    update: {
      name: canonicalName,
      bio: stripForMeta(String(bio || ""), 600) || null,
      beat: stripForMeta(String(beat || ""), 160) || null,
      experience: stripForMeta(String(experience || ""), 300) || null,
      imageUrl: cleanedImageUrl,
      professionalUrl: cleanedProfessionalUrl,
      email: cleanedEmail,
    },
  });

  return res.status(200).json(profile);
}
