"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamo_1 = __importDefault(require("./dynamo"));
const email_1 = __importDefault(require("./email"));
const encrypt_1 = __importDefault(require("./encrypt"));
const getFile_1 = __importDefault(require("./getFile"));
exports.start = async (event) => {
    let records = 0;
    for (const record of event.Records) {
        if (await dynamo_1.default(record.messageId, record.receiptHandle)) {
            console.error("Duplicate", record);
            continue;
        }
        const json = JSON.parse(record.body);
        for (const payload of json) {
            const content = await getFile_1.default(payload.report.url);
            let encryptedPdf;
            if (payload.report.encrypt && payload.report.password !== undefined) {
                encryptedPdf = encrypt_1.default(content, payload.report.password);
            }
            else {
                encryptedPdf = content;
            }
            const mail = email_1.default(await encryptedPdf, payload);
            if (await mail) {
                records++;
            }
            else {
                throw "Failed";
            }
        }
    }
    return {
        num: records,
    };
};