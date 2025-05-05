import boto3
from botocore.exceptions import ClientError
from typing import List, Dict, Any
import logging
from ..config.settings import settings

logger = logging.getLogger(__name__)

class R2Service:
    def __init__(self):
        self.client = self._get_r2_client()
        self.bucket = settings.R2_BUCKET_NAME

    def _get_r2_client(self):
        """Initialize and return R2 client"""
        return boto3.client(
            's3',
            endpoint_url=settings.R2_ENDPOINT_URL,
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY
        )

    async def upload_file(self, file_obj, workspace_name: str, filename: str) -> Dict[str, Any]:
        """Upload a file to R2"""
        try:
            # Construct object key
            prefix = workspace_name.strip('/')
            object_key = f"{prefix}/{filename}" if prefix else filename

            # Upload file
            self.client.upload_fileobj(
                Fileobj=file_obj,
                Bucket=self.bucket,
                Key=object_key
            )

            return {
                "message": "File uploaded successfully",
                "filename": filename,
                "stored_key": object_key,
                "bucket": self.bucket
            }
        except ClientError as e:
            logger.error(f"R2 upload error: {e}")
            raise

    async def list_files(self, workspace_name: str) -> List[Dict[str, Any]]:
        """List files in a workspace"""
        try:
            prefix = workspace_name.strip('/')
            if prefix:
                prefix += '/'

            files_list = []
            paginator = self.client.get_paginator('list_objects_v2')
            page_iterator = paginator.paginate(Bucket=self.bucket, Prefix=prefix, Delimiter='/')

            for page in page_iterator:
                if 'Contents' in page:
                    for obj in page.get('Contents', []):
                        key = obj.get('Key')
                        if key and key != prefix:
                            relative_name = key[len(prefix):] if prefix else key
                            if relative_name:
                                files_list.append({
                                    "name": relative_name,
                                    "key": key,
                                    "size": obj.get('Size'),
                                    "last_modified": obj.get('LastModified').isoformat() if obj.get('LastModified') else None
                                })

            return files_list
        except ClientError as e:
            logger.error(f"R2 list error: {e}")
            raise

    async def download_file(self, file_key: str) -> bytes:
        """Download a file from R2"""
        try:
            response = self.client.get_object(Bucket=self.bucket, Key=file_key)
            return response['Body'].read()
        except ClientError as e:
            logger.error(f"R2 download error: {e}")
            raise

r2_service = R2Service() 