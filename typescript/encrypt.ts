import { promises as fs } from "fs";
import { encrypt, QPdfOptions } from "node-qpdf2";

export default async (file: Buffer, password: string): Promise<Buffer> => {
  const userPassword = password || "1234";

  const options: QPdfOptions = {
    keyLength: 256,
    password: userPassword,
  };

  // Take the file buffer and write it, until I get Buffer in node-qpdf2
  const filePath = "/tmp/input.pdf";
  await fs.writeFile(filePath, file);

  const outputFile = "/tmp/encrypted.pdf";

  try {
    await encrypt(filePath, options, outputFile);
  } catch (error) {
    console.error(JSON.stringify(error));
  }

  // I want to return a Buffer
  return fs.readFile(outputFile);
};
