/// <reference types="https://deno.land/x/deno/ns.d.ts" />

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// @ts-ignore
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3";

const R2_ACCOUNT_ID = Deno.env.get("R2_ACCOUNT_ID")!;
const R2_ACCESS_KEY_ID = Deno.env.get("R2_ACCESS_KEY_ID")!;
const R2_SECRET_ACCESS_KEY = Deno.env.get("R2_SECRET_ACCESS_KEY")!;
const R2_BUCKET = Deno.env.get("R2_BUCKET")!;
const R2_PUBLIC_BASE_URL = Deno.env.get("R2_PUBLIC_BASE_URL")!;

serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Método não permitido" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ error: "Content-Type inválido" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file");
    const year =
      formData.get("year")?.toString() ||
      String(new Date().getFullYear());

    const slug =
      formData.get("slug")?.toString() || "";

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({
          error: "Arquivo não enviado.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // limite 20MB
    if (file.size > 20 * 1024 * 1024) {
      return new Response(
        JSON.stringify({
          error: "Arquivo excede 20MB.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return new Response(
        JSON.stringify({
          error: "Apenas PDFs são aceitos.",
          debug: {
            type: file.type,
            name: file.name,
          },
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const originalName = slug || file.name;

    const safeName = originalName.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    const finalName = safeName.endsWith(".pdf")
      ? safeName
      : `${safeName}.pdf`;

    const r2Key = `reports/documents/${year}/${finalName}`;

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const arrayBuffer = await file.arrayBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: r2Key,
        Body: new Uint8Array(arrayBuffer),
        ContentType: "application/pdf",
        CacheControl:
          "public, max-age=31536000, immutable",
      })
    );

    const url = `${R2_PUBLIC_BASE_URL}/${r2Key}`;

    return new Response(
      JSON.stringify({
        url,
        key: r2Key,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({
        error: "Falha ao enviar para R2",
        details: e?.message || "Erro desconhecido",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});