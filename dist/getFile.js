"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const amazon_s3_uri_1 = __importDefault(require("amazon-s3-uri"));
const s3 = new s3_1.default({});
async function default_1(url) {
    try {
        const { _region, bucket, key } = amazon_s3_uri_1.default(url);
        const params = {
            Bucket: bucket,
            Key: key,
        };
        const payload = await s3.getObject(params).promise();
        return payload.Body;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.default = default_1;
