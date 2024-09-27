import * as openpgp from "openpgp";
import * as fs from "fs/promises";

export async function generatePGPKeys() {
  return await openpgp.generateKey({
    type: "ecc", // Tipo de chave: ECC (Curve25519)
    curve: "curve25519",
    userIDs: [{ name: "Eduardo", email: "email@email.com" }],
    passphrase: "", // Adicione sua senha aqui, se aplicável
  });
}

export async function generateAndSaveKeys() {
  const { privateKey, publicKey } = await generatePGPKeys();
  await fs.writeFile("privateKey.asc", privateKey);
  await fs.writeFile("publicKey.asc", publicKey);
  console.log("Chaves geradas e salvas em 'privateKey.asc' e 'publicKey.asc'.");
}
