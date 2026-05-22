import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET = process.env.R2_BUCKET!;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL!;

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const form = new IncomingForm();
  form.maxFileSize = 20 * 1024 * 1024; // 20MB

  try {
    await runMiddleware(req, res, form.parse.bind(form));
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao processar arquivo', details: err.message });
      }
      const file = files.file;
      const year = fields.year?.toString() || String(new Date().getFullYear());
      const slug = fields.slug?.toString() || '';

      if (!file) {
        return res.status(400).json({ error: 'Arquivo não enviado.' });
      }
      if (Array.isArray(file)) {
        return res.status(400).json({ error: 'Envie apenas um arquivo.' });
      }
      if (file.size > 20 * 1024 * 1024) {
        return res.status(400).json({ error: 'Arquivo excede 20MB.' });
      }
      if (!file.mimetype?.includes('pdf')) {
        return res.status(400).json({ error: 'Apenas PDFs são aceitos.' });
      }
      const originalName = slug || file.originalFilename || 'arquivo.pdf';
      const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const finalName = safeName.endsWith('.pdf') ? safeName : `${safeName}.pdf`;
      const r2Key = `reports/documents/${year}/${finalName}`;

      const fileBuffer = await fs.promises.readFile(file.filepath);

      try {
        await s3.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: r2Key,
            Body: fileBuffer,
            ContentType: 'application/pdf',
            CacheControl: 'public, max-age=31536000, immutable',
          })
        );
        const url = `${R2_PUBLIC_BASE_URL}/${r2Key}`;
        return res.status(200).json({ url, key: r2Key });
      } catch (e: any) {
        return res.status(500).json({ error: 'Falha ao enviar para R2', details: e?.message || 'Erro desconhecido' });
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: 'Erro interno', details: e?.message || 'Erro desconhecido' });
  }
}
