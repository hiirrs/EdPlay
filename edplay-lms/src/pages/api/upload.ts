import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

// Disable body parser agar formidable bisa jalan
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
    const allowedExtensions = ['.pdf', '.ppt', '.pptx'];

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
        uploadDir,
        keepExtensions: true,
        filename: (_name, ext, part) => {
            const timestamp = Date.now();
            return `${timestamp}-${part.originalFilename}`;
        },
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Upload error', err);
            return res.status(500).json({ error: 'Upload failed' });
        }

        const rawFile = files.file;

        if (!rawFile) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;
        const filename = path.basename(file.filepath);

        if (!allowedExtensions.includes(path.extname(filename))) {
            return res.status(400).json({ error: 'File type not allowed' });
        }

        const filePath = `/uploads/${filename}`;
        return res.status(200).json({ path: filePath });
    });
}
