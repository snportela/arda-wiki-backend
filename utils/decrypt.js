const forge = require("node-forge");
const fs = require("node:fs");

let privateKey = forge.pki.privateKeyFromPem(process.env.PRIVATE_KEY);

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
