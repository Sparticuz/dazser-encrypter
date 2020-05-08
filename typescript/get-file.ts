import S3 from "aws-sdk/clients/s3";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import AmazonS3URI from "amazon-s3-uri";

const s3 = new S3({});

export default async function (url: string): Promise<Buffer> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const { region, bucket, key } = AmazonS3URI(url);

    const parameters: S3.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };

    const payload = await s3.getObject(parameters).promise();

    return payload.Body as Buffer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
