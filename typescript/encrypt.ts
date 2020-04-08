import { promises as fs } from "fs";
import { encrypt, QPdfOptions } from "node-qpdf2";

if (process.env.LAMBDA_TASK_ROOT) {
  process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}/bin`;
} else {
  process.env.PATH = `${process.env.PATH}:./bin`;
}

export default async function (
  file: Buffer,
  password: string
): Promise<Buffer> {
  if (password === "") password = "1234";

  const options: QPdfOptions = {
    keyLength: 256,
    password,
  };

  //Take the file buffer and write it, until I get Buffer in node-qpdf2
  const filePath = "/tmp/input.pdf";
  await fs.writeFile(filePath, file);

  const outputFile = "/tmp/encrypted.pdf";

  await encrypt(filePath, options, outputFile);

  // I want to return a Buffer
  return fs.readFile(outputFile);
}
