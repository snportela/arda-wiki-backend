const JSEncrypt = require("jsencrypt").JSEncrypt;

let crypt = new JSEncrypt();

let privkey = `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMno4gLxRJJyKDoL
2b8w++y+6K8/lrGOxFv6oFFW874SYbj8YFepZcIj9o+Qe7WNRSgdVdtbC6l0GAkQ
NPV6/ZwiX4N53wBvhBryeP5fNxEvz+UTXLT7DCTxeH6kDNFNU3SXBuqA1DCAJogt
wNgK9WsEU2GXiy/Td1ax71VDkZZLAgMBAAECgYANU+gHVbG3EP4CxuF6s1sNx5RI
bSQfWFMx1xtaAylXtJLqyQ36+12SMRmHZHwmAcs82KLgNeRRLS6g+obkZVf0JmAf
4DWNGGYAMacdLkER4eThdfjZ5RFVINdpOFaQaFQBUJfqvA1RLI+Zrgwu/JAEWT3O
Y0Msb8x4IPa1BzTosQJBAPS0WUddRCOAEWIV1zORTzXX0Xp4KnePcMVWBcQg4z0d
nOCSlcZKe+M39At4EVAiZA3IoUUd+MM8Zy+e8Joixu0CQQDTOtT2arKYShFlWOzb
+vbxKmpM5BNV92zptMEV52Nq9qmjNUm5O6M44HryAP4TSziY6iqou5VViDmh3XjJ
grMXAkEAvRIADWjdtgRE6iFv9pMmvbZ0T4k7XsfA3Wha6jBzA4y24rm/6ccxM93O
vXHXBrCb2B6VpL7Er60jGSNYSe/m/QJAHGHdV7cChF//cmS+fth78e/HFMnYp0Z1
xflZsH3E6Ax4wstYOqF+zxeqrXXgrer/kdx1GvMJn9KMG+nMXxdGxQJAGwmbJIhR
TFaeqb48nByjpKCEvncGRWM5589r+W5tINrrLjE1vmvCYsHUTWNARoMEJmvjJX0X
wS3nemXtzNJcHg==
-----END PRIVATE KEY-----`;

async function decryptPassword(encrypted) {
  let uncrypted = await crypt.decrypt(encrypted);
  return uncrypted;
}

module.exports = decryptPassword;
