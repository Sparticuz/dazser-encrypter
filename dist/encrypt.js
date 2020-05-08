"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const node_qpdf2_1 = require("node-qpdf2");
if (process.env.LAMBDA_TASK_ROOT) {
    process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}/bin`;
}
else {
    process.env.PATH = `${process.env.PATH}:./bin`;
}
async function default_1(file, password) {
    const userPassword = password || "1234";
    const options = {
        keyLength: 256,
        password: userPassword,
    };
    const filePath = "/tmp/input.pdf";
    await fs_1.promises.writeFile(filePath, file);
    const outputFile = "/tmp/encrypted.pdf";
    await node_qpdf2_1.encrypt(filePath, options, outputFile);
    return fs_1.promises.readFile(outputFile);
}
exports.default = default_1;
