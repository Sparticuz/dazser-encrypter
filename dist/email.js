"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeType = void 0;
const sqs_1 = __importDefault(require("aws-sdk/clients/sqs"));
const upload_1 = __importDefault(require("./upload"));
var MergeType;
(function (MergeType) {
    MergeType["MARKET"] = "market.html";
    MergeType["NOTIFY"] = "notify.html";
    MergeType["TEXT"] = "text.hbs";
})(MergeType = exports.MergeType || (exports.MergeType = {}));
exports.default = async (pdf, payload) => {
    const filePath = await upload_1.default(payload.regionnum, pdf, true);
    const email = {
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
    const sqs = new sqs_1.default({ apiVersion: "2012-11-05" });
    const sqsPost = {
        MessageBody: JSON.stringify(email),
        QueueUrl: process.env.SQS_EMAIL_QUEUE,
    };
    try {
        await sqs.sendMessage(sqsPost).promise();
        return true;
    }
    catch {
        return false;
    }
};
