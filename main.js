import * as fs from "fs";
import { generateAndSaveKeys } from "./utils/generate.js";
import { encryptPDF } from "./utils/encrypt.js";
import { decryptPDF } from "./utils/decrypt.js";

const publicKeyPath = "publicKey.asc";
const privateKeyPath = "privateKey.asc";

// Verifica se existem as chaves
if (!fs.existsSync(publicKeyPath) || !fs.existsSync(privateKeyPath)) {
  console.log("Criando as chaves: privateKey.asc e publicKey.asc");
  await generateAndSaveKeys();
} else {
  console.log("Chaves já existem: privateKey.asc e publicKey.asc");
}

// Verifica se o arquivo PDF existe
const pdfFile = "document.pdf";
if (!fs.existsSync(pdfFile)) {
  console.error(
    `Arquivo PDF não encontrado: ${pdfFile}. Crie o arquivo PDF dentro do diretório raiz.`
  );
  process.exit(1);
}

const main = async () => {
  try {
    // Criptografa o PDF
    const encryptedFile = await encryptPDF(pdfFile, publicKeyPath);
    // Descriptografa o PDF
    await decryptPDF(encryptedFile, privateKeyPath);
  } catch (error) {
    console.error("Erro durante a criptografia/descriptografia:", error);
  }
};

main();
