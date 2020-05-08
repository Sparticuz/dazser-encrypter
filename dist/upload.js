"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const path_1 = require("path");
const uuid_1 = require("uuid");
const bucket = process.env.S3_BUCKET;
const s3 = new s3_1.default({});
async function default_1(region, content, isAttachment) {
    const date = new Date();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();
    const key = `${uuid_1.v4().replace(/-/g, "")}.pdf`;
    const path = isAttachment
        ? path_1.join("attachments", key)
        : path_1.join(region.toString(), year, month, key);
    const upload = await s3
        .upload({
        Body: content,
        Bucket: bucket,
        ContentType: "application/pdf",
        Key: path,
        Metadata: {},
    })
        .promise();
    return upload.Location;
}
exports.default = default_1;
