"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const parseS3Uri = (url) => {
    const regex = /^https:\/\/([\w-]+)\.s3(-(\w\w-\w+-\d))?\.amazonaws\.com\/(.*?)((#|%23).*)?$/;
    const tokens = regex.exec(url);
    if (!tokens) {
        return { bucket: undefined, key: undefined, region: undefined };
    }
    const [, bucket, , region = "us-east-1", key] = tokens;
    return { bucket, key, region };
};
const s3 = new s3_1.default({});
exports.default = async (url) => {
    const { bucket, key } = parseS3Uri(url);
    if (bucket && key) {
        const parameters = {
            Bucket: bucket,
            Key: key,
        };
        const payload = await s3.getObject(parameters).promise();
        return payload.Body;
    }
    throw new Error("Failed to parse S3 URI");
};
