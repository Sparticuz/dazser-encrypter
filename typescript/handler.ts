/* eslint-disable no-await-in-loop */
import checkMessage from "./dynamo";
import send from "./email";
import encrypt from "./encrypt";
import getFile from "./get-file";

export enum MergeType {
  FRANPROSPECT = "franchisesales.html",
  INVOICE = "invoice.html",
  MARKET = "market.html",
  NOTIFY = "notify.html",
  PERFORMANCE = "performance.html",
  TEXT = "text.hbs",
  TRANSACTIONAL = "transactional.html",
}

export interface EmailPayload {
  attachment: {
    // This is the incoming PDF attachment and Password
    password: string;
    url: string;
  };
  body: string;
  from: {
    address: string;
    name: string;
  };
  regionnum: string;
  subject: string;
  template: MergeType;
  to: {
    address: string;
    name: string;
  };
}

export default async (event: AWSLambda.SQSEvent): Promise<{ num: number }> => {
  let records = 0;

  // First, let's loop through the sqs events
  for (const record of event.Records) {
    // Check if we've already seen this record
    if (await checkMessage(record.messageId, record.receiptHandle)) {
      console.error("Duplicate", record);
    } else {
      // Get the body of the record
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = JSON.parse(record.body);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payloads: EmailPayload[] =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof json[Symbol.iterator] !== "function" ? [json] : json;

      // For each payload in the json body
      for (const payload of payloads) {
        // Get the Attachment from s3
        const content = await getFile(payload.attachment.url);

        // Once I have it, encrypt it
        let encryptedPdf;
        if (payload.attachment.password !== undefined) {
          encryptedPdf = encrypt(content, payload.attachment.password);
        } else {
          encryptedPdf = content;
        }

        // Send an email to the FO
        const mail = send(await encryptedPdf, payload);

        if (await mail) {
          records += 1;
        } else {
          throw new Error("Failed");
        }
      }
    }
  }

  return {
    num: records,
  };
};
