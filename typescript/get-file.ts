import S3 from "aws-sdk/clients/s3";

const parseS3Uri = (url: string) => {
  const regex = /^https:\/\/([\w-]+)\.s3(-(\w\w-\w+-\d))?\.amazonaws\.com\/(.*?)((#|%23).*)?$/;
  const tokens = regex.exec(url);
  if (!tokens) {
    return { bucket: undefined, key: undefined, region: undefined };
  }
  const [, bucket, , region = "us-east-1", key] = tokens;
  return { bucket, key, region };
};

const s3 = new S3({});

export default async (url: string): Promise<Buffer> => {
  const { bucket, key } = parseS3Uri(url);

  if (bucket && key) {
    const parameters: S3.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };

    const payload = await s3.getObject(parameters).promise();
    return payload.Body as Buffer;
  }

  throw new Error("Failed to parse S3 URI");
};
