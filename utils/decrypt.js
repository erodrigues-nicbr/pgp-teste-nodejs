import * as openpgp from "openpgp";
import * as fs from "fs/promises";

export async function decryptPDF(
  encryptedPdfPath,
  privateKeyPath,
  decryptedPdfPath = undefined
) {
  try {
    // Ler arquivo binário (ao invés de utf8)
    const encryptedMessage = await fs.readFile(encryptedPdfPath);
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

    // Verifica se a mensagem está no formato armado ou binário
    let message;
    if (
      encryptedMessage
        .toString("utf8")
        .startsWith("-----BEGIN PGP MESSAGE-----")
    ) {
      message = await openpgp.readMessage({
        armoredMessage: encryptedMessage.toString("utf8"), // Converte para string se estiver em formato armored
      });
    } else {
      message = await openpgp.readMessage({
        binaryMessage: encryptedMessage, // Caso contrário, trata como binário
      });
    }

    const { data: decryptedPdfData } = await openpgp.decrypt({
      message,
      decryptionKeys: privateKey,
      format: "binary", // Indica que estamos trabalhando com dados binários
    });

    decryptedPdfPath =
      decryptedPdfPath ??
      encryptedPdfPath.replace(".encrypted.asc", ".decrypted.pdf");
    await fs.writeFile(decryptedPdfPath, decryptedPdfData, "binary"); // Salva o PDF como binário
    console.log(`PDF descriptografado salvo como: ${decryptedPdfPath}`);
    return decryptedPdfPath;
  } catch (error) {
    console.error("Erro durante a descriptografia:", error);
    throw error;
  }
}
