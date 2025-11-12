
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';
import slugify from 'slugify';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();

  if (req.method === 'GET') {
    try {
      const articles = await db.all('SELECT * FROM articles ORDER BY createdAt DESC');
      res.status(200).json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch articles', error });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, mediaUrl, mediaType } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      const baseSlug = slugify(title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure slug is unique
      while (await db.get('SELECT 1 FROM articles WHERE slug = ?', slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const result = await db.run(
        'INSERT INTO articles (title, content, slug, mediaUrl, mediaType) VALUES (?, ?, ?, ?, ?)',
        title,
        content,
        slug,
        mediaUrl,
        mediaType
      );
      
      const newArticle = await db.get('SELECT * FROM articles WHERE id = ?', result.lastID);

      res.status(201).json(newArticle);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create article', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
