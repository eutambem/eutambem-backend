const EmailVerificationService = require('../../app/services/emailVerificationService');
const crypto = require('crypto');

describe('EmailVerificationService', () => {
    let mockClient;
    let mockEmailDriver;
    let mockDb;
    let mockDbCollection;
    let service;
    let report;
    let callback;

    beforeEach(() => {
        process.env.EMAIL_FROM_ADDRESS = 'no-reply@eutambem.org';
        Date.now = jest.fn(() => 1539197013420);

        mockClient = { sendEmail: jest.fn((options, callback) => { callback(null); }) };
        mockEmailDriver = { createClient: jest.fn(() => mockClient) };
        mockDbCollection = { insertOne: jest.fn((doc, callback) => { callback(null); }) };
        mockDb = { collection: jest.fn(() => mockDbCollection) };
        service = new EmailVerificationService({ emailDriver: mockEmailDriver, db: mockDb, baseURL: 'https://eutambem.org' });
        report = { _id: '123456', email: 'user@example.com' };
        callback = jest.fn();
    });

    it('should send verification email with the correct parameters', () => {
        service.sendVerificationEmail(report, callback);

        expect(mockEmailDriver.createClient).toBeCalled();
        expect(mockClient.sendEmail).toBeCalledWith({
            to: 'user@example.com',
            from: 'no-reply@eutambem.org',
            subject: 'Verifique seu endereço de e-mail',
            message: expect.anything(),
        }, expect.anything());
    });

    it('should not send verification email if could not save token', () => {
        mockDbCollection = { insertOne: jest.fn((doc, callback) => { callback('db_error'); }) };

        service.sendVerificationEmail(report, callback);

        expect(mockClient.sendEmail).not.toBeCalled();
        expect(callback).toBeCalledWith('db_error');
    });

    it('should invoke the callback without errors after sending email', () => {
        service.sendVerificationEmail(report, callback);

        expect(callback).toBeCalledWith(null);
    });

    it('should invoke the callback with errors if sending email fails', () => {
        mockClient = { sendEmail: jest.fn((options, callback) => { callback('email_error'); }) };

        service.sendVerificationEmail(report, callback);

        expect(callback).toBeCalledWith('email_error');
    });

    it('should store a validation token in the database with the report id and date', () => {
        const token = service.createToken(report);

        service.sendVerificationEmail(report, callback);

        expect(mockDb.collection).toBeCalledWith('validation_token');
        expect(mockDbCollection.insertOne).toBeCalledWith({
            'report_id': '123456',
            'token': token,
            'date': new Date(1539197013420),
        }, expect.anything());
    });

    it('should create a token from the report\'s id and current date', () => {
        expect(service.createToken(report)).toEqual('cbfc7270b782affe5e2692621910f0c555f7d2800be536fd03da3d82361dabd1');
    });

    it('should send the link to verify email containing the token', () => {
        const token = service.createToken(report);

        service.sendVerificationEmail(report, callback);
        const email = mockClient.sendEmail.mock.calls[0][0];

        expect(email.message).toContain('https://eutambem.org/verify?token=' + token);
    });

    // verification
    describe('When verifying a token', () => {
        const mockTokenObject = {
            '_id': '123423212312',
            'report_id': '123456',
            'token': 'abc123',
            'date': new Date(1539197013420),
        };

        it('should get the report by the verification token', () => {
            mockDbCollection = { find: jest.fn((params, callback) => {
                if (params.token == 'abc123') {
                    callback(null, mockTokenObject);
                    return;
                }
                if (params._id == '123456') {
                    callback(null, report);
                }
            }) };

            service.getReportFromToken('abc123', callback);

            expect(mockDb.collection).toBeCalledWith('validation_token');
            expect(mockDbCollection.find).toBeCalledWith({ token: 'abc123' }, expect.anything());
            expect(mockDb.collection).toBeCalledWith('report');
            expect(mockDbCollection.find).toBeCalledWith({ _id: '123456' }, expect.anything());
            expect(callback).toBeCalledWith(null, report);
        });

        it('should return an error when it cannot find the verification token', () => {
            mockDbCollection = { find: jest.fn((params, callback) => {
                if (params.token == 'abc123') callback('error');
            }) };

            service.getReportFromToken('abc123', callback);

            expect(callback).toBeCalledWith('error');
        });

        it('should return an error when it cannot find the report', () => {
            mockDbCollection = { find: jest.fn((params, callback) => {
                if (params.token == 'abc123') {
                    callback(null, mockTokenObject);
                    return;
                }
                if (params._id == '123456') {
                    callback('error');
                }
            }) };

            service.getReportFromToken('abc123', callback);

            expect(callback).toBeCalledWith('error');
        });
    });
});
