const mongoose = require('mongoose');

const { ObjectID } = mongoose.mongo;
const EmailVerificationService = require('../../app/services/emailVerificationService');
const Report = require('../../app/models/reports');
const { ValidationToken } = require('../../app/models/reports');

describe('EmailVerificationService', () => {
  let mockClient;
  let mockEmailDriver;
  let mockDb;
  let service;
  let report;
  let callback;

  beforeEach(() => {
    process.env.EMAIL_FROM_ADDRESS = 'no-reply@eutambem.org';
    Date.now = jest.fn(() => 1539197013420);

    mockClient = { sendEmail: jest.fn((options, sendCallback) => { sendCallback(null); }) };
    mockEmailDriver = { createClient: jest.fn(() => mockClient) };
    ValidationToken.create = jest.fn((doc, createCallback) => createCallback(null, doc));
    service = new EmailVerificationService({ emailDriver: mockEmailDriver, db: mockDb, baseURL: 'https://eutambem.org' });
    report = { _id: ObjectID('5bbe570e06bbc0e1354679a5'), email: 'user@example.com' };
    callback = jest.fn();
  });

  it('should send verification email with the correct parameters if token was saved', () => {
    service.sendVerificationEmail(report, callback);

    expect(mockEmailDriver.createClient).toBeCalled();
    expect(mockClient.sendEmail).toBeCalledWith({
      to: 'user@example.com',
      from: 'EuTambem <no-reply@eutambem.org>',
      subject: 'Verifique seu endereço de e-mail',
      message: expect.anything(),
    }, expect.anything());
  });

  it('should not send verification email if could not save token', () => {
    ValidationToken.create = jest.fn((doc, createCallback) => createCallback('db_error'));

    service.sendVerificationEmail(report, callback);

    expect(mockClient.sendEmail).not.toBeCalled();
    expect(callback).toBeCalledWith('db_error');
  });

  it('should invoke the callback without errors after sending email', () => {
    service.sendVerificationEmail(report, callback);

    expect(callback).toBeCalledWith(null);
  });

  it('should invoke the callback with errors if sending email fails', () => {
    mockClient = { sendEmail: jest.fn((options, sendCallback) => { sendCallback('email_error'); }) };

    service.sendVerificationEmail(report, callback);

    expect(callback).toBeCalledWith('email_error');
  });

  it('should store a validation token in the database with the report id and date', () => {
    const token = service.createToken(report);

    service.sendVerificationEmail(report, callback);

    expect(ValidationToken.create).toBeCalledWith({
      reportId: ObjectID('5bbe570e06bbc0e1354679a5'),
      token,
      date: new Date(1539197013420),
    }, expect.anything());
  });

  it('should create a token from the report\'s id and current date', () => {
    expect(service.createToken(report)).toEqual('de30e68521e4b59c2ac5a293f3a6aa508979fb6552b67f280bc54d11aa413a31');
  });

  it('should send the link to verify email containing the token', () => {
    const token = service.createToken(report);

    service.sendVerificationEmail(report, callback);
    const email = mockClient.sendEmail.mock.calls[0][0];

    expect(email.message).toContain(`https://eutambem.org/verify?token=${token}`);
  });

  describe('When verifying a token', () => {
    let mockTokenObject;
    beforeEach(() => {
      mockTokenObject = {
        _id: ObjectID('5bbe56ef82857ee0f145be32'),
        reportId: report._id,
        token: 'abc123',
        date: new Date(1539197013420),
      };
      ValidationToken.findOne = jest.fn((params, findCallback) => {
        if (params.token === 'abc123') {
          findCallback(null, mockTokenObject);
        }
      });
      ValidationToken.deleteOne = jest.fn((filter, deleteCallback) => { deleteCallback(null); });
      Report.findById = jest.fn((id, findCallback) => findCallback(null, report));
      Report.findByIdAndUpdate = jest.fn(
        (id, update, options, updateCallback) => updateCallback(null),
      );
    });

    it('should get the report by the verification token', () => {
      service.getReportFromToken('abc123', callback);

      expect(ValidationToken.findOne).toBeCalledWith({ token: 'abc123' }, expect.anything());

      expect(Report.findById).toBeCalledWith(report._id, expect.anything());
      expect(callback).toBeCalledWith(null, report, mockTokenObject);
    });

    it('should return an error when there is an error finding the verification token', () => {
      ValidationToken.findOne = jest.fn((params, findCallback) => {
        if (params.token === 'abc123') findCallback('error');
      });

      service.verify('abc123', callback);

      expect(Report.findByIdAndUpdate).not.toBeCalled();
      expect(ValidationToken.deleteOne).not.toBeCalled();
      expect(callback).toBeCalledWith('error');
    });

    it('should return an error when the verification token does not exist', () => {
      ValidationToken.findOne = jest.fn((params, findCallback) => {
        if (params.token === 'abc123') findCallback(null, null);
      });

      service.verify('abc123', callback);

      expect(Report.findByIdAndUpdate).not.toBeCalled();
      expect(ValidationToken.deleteOne).not.toBeCalled();
      expect(callback).toBeCalledWith('Validation token not found');
    });

    it('should return an error when there is an error finding the report', () => {
      ValidationToken.findOne = jest.fn((params, findCallback) => {
        if (params.token === 'abc123') {
          findCallback(null, mockTokenObject);
        }
      });
      Report.findById = jest.fn((id, findCallback) => findCallback('error'));

      service.verify('abc123', callback);

      expect(Report.findByIdAndUpdate).not.toBeCalled();
      expect(ValidationToken.deleteOne).not.toBeCalled();
      expect(callback).toBeCalledWith('error');
    });

    it('should return an error when it cannot find the report', () => {
      ValidationToken.findOne = jest.fn((params, findCallback) => {
        if (params.token === 'abc123') {
          findCallback(null, mockTokenObject);
        }
      });
      Report.findById = jest.fn((id, findCallback) => findCallback(null, null));

      service.verify('abc123', callback);

      expect(Report.findByIdAndUpdate).not.toBeCalled();
      expect(ValidationToken.deleteOne).not.toBeCalled();
      expect(callback).toBeCalledWith('Report not found');
    });

    it('should update the report with the email verified parameter', () => {
      service.verify('abc123', callback);

      expect(Report.findByIdAndUpdate).toBeCalledWith(
        report._id,
        { emailVerified: true },
        expect.anything(),
        expect.anything(),
      );
      expect(callback).toBeCalledWith(null);
    });

    it('should delete the verification token', () => {
      service.verify('abc123', callback);

      expect(ValidationToken.deleteOne).toBeCalledWith(
        { _id: mockTokenObject._id },
        expect.anything(),
      );
    });
  });
});
