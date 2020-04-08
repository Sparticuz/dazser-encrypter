import S3 from "aws-sdk/clients/s3";
import AmazonS3URI from "amazon-s3-uri";

const s3 = new S3({});

export default async function (url: string): Promise<Buffer> {
  try {
    const { _region, bucket, key } = AmazonS3URI(url);

    const params: S3.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };

    const payload = await s3.getObject(params).promise();

    return payload.Body as Buffer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
