import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

  const { filename, year, contentType } = req.body || {};
  if (!filename || !year || !contentType) {
    return res.status(400).json({ error: 'filename, year e contentType são obrigatórios' });
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const finalName = safeName.endsWith('.pdf') ? safeName : `${safeName}.pdf`;
  const r2Key = `reports/documents/${year}/${finalName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 minutos
    const publicUrl = `${R2_PUBLIC_BASE_URL}/${r2Key}`;
    return res.status(200).json({ signedUrl, publicUrl, key: r2Key });
  } catch (e: any) {
    return res.status(500).json({ error: 'Falha ao gerar signed URL', details: e?.message || 'Erro desconhecido' });
  }
}
