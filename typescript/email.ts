// This actually posts a payload to SQS
import SQS from "aws-sdk/clients/sqs";
import type { EmailPayload } from "./handler";
import upload from "./upload";

export enum MergeType {
  MARKET = "market.html",
  NOTIFY = "notify.html",
  TEXT = "text.hbs",
}

// Exclude to and attachment
interface SqsPayload extends Omit<EmailPayload, "to" | "attachment"> {
  attachments: string[];
  to: string;
}

export default async (pdf: Buffer, payload: EmailPayload): Promise<boolean> => {
  const filePath = await upload(payload.regionnum, pdf, true);

  const email: SqsPayload = {
    attachments: [filePath],
    body: payload.body,
    from: {
      address: payload.from.address,
      name: payload.from.name,
    },
    regionnum: payload.regionnum,
    subject: payload.subject,
    template: MergeType.NOTIFY,
    to: payload.to.address,
  };

  const sqs = new SQS({ apiVersion: "2012-11-05" });
  const sqsPost: SQS.SendMessageRequest = {
    MessageBody: JSON.stringify(email),
    QueueUrl: process.env.SQS_EMAIL_QUEUE as string,
  };

  try {
    await sqs.sendMessage(sqsPost).promise();
    return true;
  } catch {
    return false;
  }
};
