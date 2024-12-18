const forge = require("node-forge");

const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALRxlRez+T8bQ4B0
cJvKoSO/FPuuOREuFWsFZ+snge4wyVY+ZcuBhCaTTooZ5+8dGnCJNrN46AgGm5rN
tRIOtlpkgwiy8bKMF+bZaWsAIqYhQ+z0JmnE4SyM4trD/MTRpIAgDhsvFHyzcRlf
WsvCR1Azrcl2HA3ENu4Yck7T4IzTAgMBAAECgYB02QSKJ+JkijwpB74QNKQqqMdm
v4h25pe6CPMlZR0PaIpIjfmPUhyIemWmqmX2AqunakOA7u+amuTS1xjFS7+rLJke
k/L4C7lY4aO3L8uMYG2FMOMuSYx4/9K7Fg3F8pma29cNwp6ssey9a4a0XyzWk4nl
naML4Icy2cnLftYu2QJBAOMbAF5H2/F8U/WvsH780g0XedwjsGs2gfaQNLPxtg1y
VAYbpDt7uPsxtLMLEQFrf5oAH8TrZhmbvv60cSR1Nw0CQQDLZsVQDTHJ0DBcIWFy
vpew0vn4ljQ0E1VkkKFEtH1gWQ8bpIf9CNQfp6CbeATjwOs309DFfxagA2G3er59
LdtfAkAX48lAIbMDTh7O43JfiVzXP7bz71UpkgxN0ZGZtD2AYJxyIApAr50f33Sw
uONLEPHVU1oELvcIjpei13xnZ2UpAkBIWsGbzWXFpaJeU52HpNbvFs3HKR9e2vXI
dU540z+6U1P1gFzDnS1gKVAPne0XW5wQ2u9sId5Zg3pyO16hxvs/AkBM5VvJj0KX
bsak2k1dZIzh5WhvaK5ZDfugQnFIExjS6spDz4/Q2xXg7ab7Nwr9tcawUM488ddH
1NYBo75xyKeE
-----END PRIVATE KEY-----`;

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
