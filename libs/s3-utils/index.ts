import { S3Event } from 'aws-lambda';

export const extractParams = (event: S3Event) => {
  const videoFileName = decodeURIComponent(
    event.Records[0].s3.object.key
  ).replace(/\+/g, ' ');
  const triggerBucketName = event.Records[0].s3.bucket.name;

  return { videoFileName, triggerBucketName };
};
