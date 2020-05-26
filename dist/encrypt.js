"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const node_qpdf2_1 = require("node-qpdf2");
exports.default = async (file, password) => {
    const userPassword = password || "1234";
    const options = {
        keyLength: 256,
        password: userPassword,
    };
    const filePath = "/tmp/input.pdf";
    await fs_1.promises.writeFile(filePath, file);
    const outputFile = "/tmp/encrypted.pdf";
    try {
        await node_qpdf2_1.encrypt(filePath, options, outputFile);
    }
    catch (error) {
        console.error(JSON.stringify(error));
    }
    return fs_1.promises.readFile(outputFile);
};
