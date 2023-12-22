import { S3Event } from 'aws-lambda';
import { extractParams } from '@s3-utils';

export const handler = async (event: S3Event): Promise<void> => {
  const { videoFileName, triggerBucketName } = extractParams(event);
  console.log({ videoFileName, triggerBucketName });
};
