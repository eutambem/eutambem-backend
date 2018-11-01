const AWS = require('aws-sdk');

const kms = () => new AWS.KMS();

module.exports.encrypt = async (data) => {
  const kmsKeyAlias = process.env.KMS_KEY_ALIAS;
  if (kmsKeyAlias === undefined) throw new Error('No KMS key inforned. Please set KMS_KEY_ALIAS env variable.');

  const params = {
    KeyId: kmsKeyAlias,
    Plaintext: data,
  };
  try {
    const result = await kms().encrypt(params).promise();
    return Buffer.from(result.CiphertextBlob).toString('base64');
  } catch (err) {
    throw new Error('Encryption error');
  }
};

module.exports.encryptUserData = async (report) => {
  const { encrypt } = module.exports;
  return {
    ...report,
    email: await encrypt(report.email),
    name: report.name ? await encrypt(report.name) : report.name,
  };
};
