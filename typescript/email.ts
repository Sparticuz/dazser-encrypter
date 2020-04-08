//This actually posts a payload to SQS
import SQS from "aws-sdk/clients/sqs";
import { RequestPayload } from "./handler";
import upload from "./upload";

export enum MergeType {
  MARKET = "market.html",
  NOTIFY = "notify.html",
  TEXT = "text.hbs",
}

declare interface Address {
  address: string;
  name: string;
}

export declare interface EmailPayload {
  to: string | string[] | Address | Address[];
  cc?: string | string[] | Address | Address[];
  bcc?: string | string[] | Address | Address[];
  subject: string;
  from: Address;
  body: string;
  // This is an iCal string
  calendar?: string;
  // This is a path to S3 for the attachment
  // This is any because it's Mail.Attachments AND string | string []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments?: any[];
  return_receipt?: boolean;
  preview?: string;
  phone: string;
  company: string;
  address_street: string;
  address_csz: string;
  template: MergeType;
}

export default async function (
  pdf: Buffer,
  payload: RequestPayload
): Promise<boolean> {
  const filePath = await upload(payload.region.num, pdf, true);

  const email: EmailPayload = {
    to: {
      address: payload.email.to.address,
      name: payload.email.to.name,
    },
    subject: payload.email.subject,
    from: {
      address: payload.email.from.address,
      name: payload.email.from.name,
    },
    body: payload.email.body,
    attachments: [filePath],
    phone: payload.email.phone,
    company: payload.email.company,
    // eslint-disable-next-line @typescript-eslint/camelcase
    address_street: payload.email.address_street,
    // eslint-disable-next-line @typescript-eslint/camelcase
    address_csz: payload.email.address_csz,
    template: MergeType.NOTIFY,
  };

  const sqs = new SQS({ apiVersion: "2012-11-05" });
  const sqsPost: SQS.SendMessageRequest = {
    QueueUrl: process.env.SQS_EMAIL_QUEUE as string,
    MessageBody: JSON.stringify(email),
  };

  try {
    await sqs.sendMessage(sqsPost).promise();
    return true;
  } catch {
    return false;
  }
}
