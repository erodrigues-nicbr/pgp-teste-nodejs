import * as openpgp from "openpgp";
import * as fs from "fs/promises";

export async function encryptPDF(pdfPath, publicKeyPath) {
  const pdfData = await fs.readFile(pdfPath); // Leia o arquivo como binário
  const publicKeyArmored = await fs.readFile(publicKeyPath, "utf8");

  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ binary: pdfData }), // Use binary para o conteúdo do PDF
    encryptionKeys: publicKey,
    format: "armored", // Mantém o conteúdo no formato armored (texto)
  });

  const encryptedPdfPath = `${pdfPath}.encrypted.asc`;
  await fs.writeFile(encryptedPdfPath, encrypted);
  console.log(`PDF criptografado salvo como: ${encryptedPdfPath}`);
  return encryptedPdfPath;
}
