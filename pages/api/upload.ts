
import type { NextApiRequest, NextApiResponse } from 'next';
import { formidable, File } from 'formidable';
import fs from 'fs';
import path from 'path';
// Fix: Import `process` to provide type definitions for `process.cwd()`.
import process from 'process';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filename: (name, ext, part, form) => {
        return `${Date.now()}_${name.replace(/\s+/g, '_')}${ext}`;
    }
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
    
    const file = files.media?.[0];

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const mediaType = file.mimetype?.startsWith('image') ? 'image' : 'video';
    const mediaUrl = `/uploads/${file.newFilename}`;

    res.status(200).json({
      message: 'File uploaded successfully',
      url: mediaUrl,
      type: mediaType,
    });
  });
}
