import DynamoDB from "aws-sdk/clients/dynamodb";
import SQS from "aws-sdk/clients/sqs";

// Configure AWS
const ddb = new DynamoDB({ apiVersion: "2012-08-10" });

export default async function (
  messageId: string,
  receiptHandle: string
): Promise<boolean> {
  // verify that we haven't seen this payload.
  const ddbExists: DynamoDB.GetItemInput = {
    AttributesToGet: ["id"],
    ConsistentRead: true,
    Key: {
      id: {
        S: messageId,
      },
    },
    TableName: process.env.DYNAMODB_TABLE as string,
  };
  const exists = await ddb.getItem(ddbExists).promise();

  if (exists.Item) {
    // if exists then return skip
    // console.log("Item Exists!", messageId);
    // we should also remove the item from sqs
    const sqs = new SQS({ apiVersion: "2012-11-05" });
    const sqsDelete: SQS.DeleteMessageRequest = {
      QueueUrl: process.env.SQS_QUEUE_URL as string,
      ReceiptHandle: receiptHandle,
    };
    sqs.deleteMessage(sqsDelete);
    return true;
  } else {
    // if it doesn't exist , enter it, then continue
    const ddbPut: DynamoDB.PutItemInput = {
      Item: {
        expires: {
          S: (Date.now() + 3.6e6).toString(),
        },
        id: {
          S: messageId,
        },
      },
      TableName: process.env.DYNAMODB_TABLE as string,
    };

    await ddb.putItem(ddbPut).promise();

    return false;
  }
}
