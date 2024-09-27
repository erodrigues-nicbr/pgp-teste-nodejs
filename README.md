# PGP Exemplo
## Exemplo de uso do PGP

O arquivo `document.pdf` vai ser criptografado pela chave pública do destinatário e depois descriptografado pela chave privada do destinatário.

As chaves geradas são:
- Chave privada do remetente: privateKey.asc
- Chave pública do remetente: publicKey.asc
- Arquivo criptografado: `document.pdf.encrypted.asc`
- Arquivo descriptografado: `document.pdf.decrypted.pdf`

## Como usar a app

```bash
npm i
node main.js
``` 

E confira os arquivos gerados

## Requisitos

- Node.js
- GPG