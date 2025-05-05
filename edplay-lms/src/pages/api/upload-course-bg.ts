import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), '/public/uploads');
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    filename: (_name, ext, part) => {
      const timestamp = Date.now();
      return `${timestamp}-${part.originalFilename?.replace(/\s+/g, '_')}`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload error', err);
      return res.status(500).json({ error: 'Upload failed' });
    }

    const rawFile = files.file;
    const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = path.basename(file.filepath);
    const ext = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      // Delete file if extension is invalid
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ error: 'Only image files are allowed' });
    }

    const filePath = `/uploads/${filename}`;
    return res.status(200).json({ path: filePath });
  });
}
