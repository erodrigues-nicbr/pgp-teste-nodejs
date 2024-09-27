import * as openpgp from "openpgp";
import * as fs from "fs/promises";

export async function decryptPDF(encryptedPdfPath, privateKeyPath) {
  try {
    const encryptedMessage = await fs.readFile(encryptedPdfPath, "utf8");
    const privateKeyArmored = await fs.readFile(privateKeyPath, "utf8");

    let privateKey = await openpgp.readPrivateKey({
      armoredKey: privateKeyArmored,
    });

    // Verifica se a chave já está descriptografada
    if (!privateKey.isDecrypted) {
      privateKey = await openpgp.decryptKey({
        privateKey,
        passphrase: "", // Adicione sua senha aqui, se aplicável
      });
    }

    const message = await openpgp.readMessage({
      armoredMessage: encryptedMessage,
    });

    const { data: decryptedPdfData } = await openpgp.decrypt({
      message,
      decryptionKeys: privateKey,
      format: "binary", // Indica que estamos trabalhando com dados binários
    });

    const decryptedPdfPath = encryptedPdfPath.replace(
      ".encrypted.asc",
      ".decrypted.pdf"
    );
    await fs.writeFile(decryptedPdfPath, decryptedPdfData, "binary"); // Salva o PDF como binário
    console.log(`PDF descriptografado salvo como: ${decryptedPdfPath}`);
    return decryptedPdfPath;
  } catch (error) {
    console.error("Erro durante a descriptografia:", error);
    throw error;
  }
}
