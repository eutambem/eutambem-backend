const sinon = require('sinon');
const AWS = require('aws-sdk');
const encryptionService = require('../../app/services/encryptionService');

describe('encryptionService', () => {
  describe('encrypt', async () => {
    const { encrypt } = encryptionService;

    const kmsStub = sinon.stub(AWS, 'KMS');

    beforeEach(() => {
      delete process.env.KMS_KEY_ALIAS;
      process.env.KMS_KEY_ALIAS = 'alias/key';
    });

    afterEach(() => {
      kmsStub.reset();
    });

    it('throws exception if KMS_KEY_ALIAS is not set', async () => {
      delete process.env.KMS_KEY_ALIAS;

      await expect(encrypt('teste')).rejects.toMatchObject({
        message: 'No KMS key inforned. Please set KMS_KEY_ALIAS env variable.',
      });
    });

    it('throws encryption error if kms encryption fails for any reason', async () => {
      kmsStub.returns({
        encrypt: () => ({
          promise: () => Promise.reject(new Error('arbitrary kms error')),
        }),
      });

      await expect(encrypt('teste')).rejects.toMatchObject({
        message: 'Encryption error',
      });
    });

    it('returns encrypted value in base64 encoding', async () => {
      kmsStub.returns({
        encrypt: () => ({
          promise: () => Promise.resolve({
            CiphertextBlob: Buffer.from('encryptedAndEncodedValue@', 'base64'),
          }),
        }),
      });
      expect(await encrypt('test')).toEqual('encryptedAndEncodedValue');
    });
  });

  describe('encryptUserData', async () => {
    const { encryptUserData } = encryptionService;

    const encryptStub = sinon.stub(encryptionService, 'encrypt');

    const report = {
      email: 'marielle@elenao.com',
      name: 'Marielle Franco',
      gender: 'woman',
    };

    afterEach(() => {
      encryptStub.reset();
    });

    it('returns report object with encrypted email and name', async () => {
      encryptStub.withArgs('marielle@elenao.com').resolves('encryptedEmail');
      encryptStub.withArgs('Marielle Franco').resolves('encryptedName');

      const encryptedReport = await encryptUserData(report);

      expect(encryptedReport.email).toEqual('encryptedEmail');
      expect(encryptedReport.name).toEqual('encryptedName');
    });

    it('returns report object with empty name if the original is empty as well', async () => {
      encryptStub.withArgs('marielle@elenao.com').resolves('encryptedEmail');
      report.name = '';

      const encryptedReport = await encryptUserData(report);

      expect(encryptedReport.email).toEqual('encryptedEmail');
      expect(encryptedReport.name).toEqual('');
    });
  });
});
