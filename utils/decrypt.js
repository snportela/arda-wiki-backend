const forge = require("node-forge");
const fs = require("node:fs");

let privateKeyPem = fs.readFileSync("./private-key.pem", "utf8");

let privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

function decryptPassword(cyphertext) {
  try {
    let ciphertextBytes = forge.util.decode64(cyphertext);
    let decryptedBytes = privateKey.decrypt(ciphertextBytes);
    let decryptedText = forge.util.decodeUtf8(decryptedBytes);
    return decryptedText;
  } catch (error) {
    console.log(error);
  }
}

module.exports = decryptPassword;
