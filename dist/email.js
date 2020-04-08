"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqs_1 = __importDefault(require("aws-sdk/clients/sqs"));
const upload_1 = __importDefault(require("./upload"));
var MergeType;
(function (MergeType) {
    MergeType["MARKET"] = "market.html";
    MergeType["NOTIFY"] = "notify.html";
    MergeType["TEXT"] = "text.hbs";
})(MergeType = exports.MergeType || (exports.MergeType = {}));
async function default_1(pdf, payload) {
    const filePath = await upload_1.default(payload.region.num, pdf, true);
    const email = {
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
        address_street: payload.email.address_street,
        address_csz: payload.email.address_csz,
        template: MergeType.NOTIFY,
    };
    const sqs = new sqs_1.default({ apiVersion: "2012-11-05" });
    const sqsPost = {
        QueueUrl: process.env.SQS_EMAIL_QUEUE,
        MessageBody: JSON.stringify(email),
    };
    try {
        await sqs.sendMessage(sqsPost).promise();
        return true;
    }
    catch {
        return false;
    }
}
exports.default = default_1;
