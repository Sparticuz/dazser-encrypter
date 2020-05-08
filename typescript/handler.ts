/* eslint-disable no-await-in-loop */
import checkMessage from "./dynamo";
import send from "./email";
import encrypt from "./encrypt";
import getFile from "./get-file";

export interface RequestPayload {
  report: {
    name: string;
    url: string;
    data?: string;
    encrypt?: boolean;
    password?: string;
  };
  email: {
    subject: string;
    to: {
      name: string;
      address: string;
    };
    body: string;
    from: {
      name: string;
      address: string;
    };
    company: string;
    phone: string;
    address_street: string;
    address_csz: string;
  };
  region: {
    name: string;
    num: number;
  };
  customer?: number;
  franchise?: number;
}

export const start = async (
  event: AWSLambda.SQSEvent
): Promise<{ num: number }> => {
  let records = 0;

  // First, let's loop through the sqs events
  for (const record of event.Records) {
    // Check if we've already seen this record
    if (await checkMessage(record.messageId, record.receiptHandle)) {
      console.error("Duplicate", record);
    } else {
      // Get the body of the record
      const json: RequestPayload[] = JSON.parse(record.body);

      // For each payload in the json body
      for (const payload of json) {
        // Get the Attachment from s3
        const content = await getFile(payload.report.url);

        // Once I have it, encrypt it
        let encryptedPdf;
        if (payload.report.encrypt && payload.report.password !== undefined) {
          encryptedPdf = encrypt(content, payload.report.password);
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
