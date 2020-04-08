import S3 from "aws-sdk/clients/s3";
import { join } from "path";
import { v4 as uuid } from "uuid";

const bucket = process.env.S3_BUCKET as string;
const s3 = new S3({});

export default async function (
  region: number,
  content: Buffer,
  isAttachment?: boolean
): Promise<string> {
  const date = new Date();
  const month = (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();
  const key = uuid().replace(/-/g, "") + ".pdf";

  const path = isAttachment
    ? join("attachments", key)
    : join(region.toString(), year, month, key);

  const upload = await s3
    .upload({
      Body: content,
      Bucket: bucket,
      ContentType: "application/pdf",
      Key: path,
      Metadata: {},
    })
    .promise();

  return upload.Location;
}
