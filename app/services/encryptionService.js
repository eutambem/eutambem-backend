var AWS = require('aws-sdk');

var kms = new AWS.KMS();
var kmsKeyAlias = process.env.KMS_KEY_ALIAS;

module.exports.encrypt = async (data) => {
  var params = {
    KeyId: kmsKeyAlias,
    Plaintext: data,
  };
  try {
    result = await kms.encrypt(params).promise();
    return Buffer.from(result.CiphertextBlob).toString("base64");
  } catch(err) {
    throw new Error("Encrypting error");
  }
}

module.exports.decrypt = async (data) => {
  var params = {
    CiphertextBlob: Buffer.from(data, "base64"),
  };
  try {
    result = await kms.decrypt(params).promise();
    return Buffer.from(result.Plaintext).toString();
  } catch(err) {
    throw new Error("Decrypting error");
  }
}