
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
  createdAt: string;
  authorName: string;
  authorAvatarUrl: string;
  publicationName?: string;
  readTimeInMinutes: number;
  claps: number;
  commentsCount: number;
}