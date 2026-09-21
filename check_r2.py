import os
import boto3
from dotenv import load_dotenv

load_dotenv(".env.local")

account_id = os.getenv("R2_ACCOUNT_ID")
access_key = os.getenv("R2_ACCESS_KEY_ID")
secret_key = os.getenv("R2_SECRET_ACCESS_KEY")
bucket = os.getenv("R2_BUCKET", "consudes-assets")

s3 = boto3.client(
    "s3",
    endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key,
    region_name="auto",
)

count = 0
total_size = 0

paginator = s3.get_paginator("list_objects_v2")

for page in paginator.paginate(
    Bucket=bucket,
    Prefix="gallery/"
):
    for obj in page.get("Contents", []):
        if obj["Key"].endswith("/"):
            continue

        count += 1
        total_size += obj["Size"]

print(f"Arquivos encontrados: {count}")
print(f"Tamanho total: {total_size / 1024 / 1024:.2f} MB")