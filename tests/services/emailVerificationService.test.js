const EmailVerificationService = require('../../app/services/emailVerificationService');

describe('EmailVerificationService', () => {
    let mockClient;
    let mockDriver;
    let service;

    beforeEach(() => {
        process.env.EMAIL_FROM_ADDRESS = 'no-reply@eutambem.org';
        mockClient = { sendEmail: jest.fn() };
        mockDriver = { createClient: jest.fn(() => mockClient) };
        service = new EmailVerificationService(mockDriver);
    });

    it('should initialize the SES client', () => {
        expect(mockDriver.createClient).toBeCalled();
    });

    it('should send verification email with the correct parameters', () => {
        const report = { email: 'user@example.com' };
        service.sendVerificationEmail(report);

        expect(mockClient.sendEmail).toBeCalledWith({
            to: 'user@example.com',
            from: 'no-reply@eutambem.org',
            subject: 'Verifique seu email pra enviar seu relato',
            message: 'Olá mundo',
        });
    });
});
