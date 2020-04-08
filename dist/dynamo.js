"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodb_1 = __importDefault(require("aws-sdk/clients/dynamodb"));
const sqs_1 = __importDefault(require("aws-sdk/clients/sqs"));
const ddb = new dynamodb_1.default({ apiVersion: "2012-08-10" });
async function default_1(messageId, receiptHandle) {
    const ddbExists = {
        AttributesToGet: ["id"],
        ConsistentRead: true,
        Key: {
            id: {
                S: messageId,
            },
        },
        TableName: process.env.DYNAMODB_TABLE,
    };
    const exists = await ddb.getItem(ddbExists).promise();
    if (exists.Item) {
        const sqs = new sqs_1.default({ apiVersion: "2012-11-05" });
        const sqsDelete = {
            QueueUrl: process.env.SQS_QUEUE_URL,
            ReceiptHandle: receiptHandle,
        };
        sqs.deleteMessage(sqsDelete);
        return true;
    }
    else {
        const ddbPut = {
            Item: {
                expires: {
                    S: (Date.now() + 3.6e6).toString(),
                },
                id: {
                    S: messageId,
                },
            },
            TableName: process.env.DYNAMODB_TABLE,
        };
        await ddb.putItem(ddbPut).promise();
        return false;
    }
}
exports.default = default_1;
