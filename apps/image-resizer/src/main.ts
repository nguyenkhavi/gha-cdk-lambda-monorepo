import { extractParams } from '@s3-utils/index';
import { S3Event } from 'aws-lambda';

export const lambdaHandler = async (event: S3Event): Promise<void> => {
  const { videoFileName, triggerBucketName } = extractParams(event);
  console.log({ videoFileName, triggerBucketName });
};
