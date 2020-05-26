"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeType = void 0;
const dynamo_1 = __importDefault(require("./dynamo"));
const email_1 = __importDefault(require("./email"));
const encrypt_1 = __importDefault(require("./encrypt"));
const get_file_1 = __importDefault(require("./get-file"));
var MergeType;
(function (MergeType) {
    MergeType["FRANPROSPECT"] = "franchisesales.html";
    MergeType["INVOICE"] = "invoice.html";
    MergeType["MARKET"] = "market.html";
    MergeType["NOTIFY"] = "notify.html";
    MergeType["PERFORMANCE"] = "performance.html";
    MergeType["TEXT"] = "text.hbs";
    MergeType["TRANSACTIONAL"] = "transactional.html";
})(MergeType = exports.MergeType || (exports.MergeType = {}));
exports.default = async (event) => {
    let records = 0;
    for (const record of event.Records) {
        if (await dynamo_1.default(record.messageId, record.receiptHandle)) {
            console.error("Duplicate", record);
        }
        else {
            const json = JSON.parse(record.body);
            const payloads = typeof json[Symbol.iterator] !== "function" ? [json] : json;
            for (const payload of payloads) {
                const content = await get_file_1.default(payload.attachment.url);
                let encryptedPdf;
                if (payload.attachment.password !== undefined) {
                    encryptedPdf = encrypt_1.default(content, payload.attachment.password);
                }
                else {
                    encryptedPdf = content;
                }
                const mail = email_1.default(await encryptedPdf, payload);
                if (await mail) {
                    records += 1;
                }
                else {
                    throw new Error("Failed");
                }
            }
        }
    }
    return {
        num: records,
    };
};
