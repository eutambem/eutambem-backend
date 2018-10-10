const ses = require('node-ses');

class EmailVerificationService {
    constructor(driver) {
        if (!driver) driver = ses;
        this.client = driver.createClient();
        this.from = process.env.EMAIL_FROM_ADDRESS;
    }

    sendVerificationEmail(report) {
        const to = report.email;
        const from = this.from;
        this.client.sendEmail({
            to: to,
            from: from,
            subject: 'Verifique seu email pra enviar seu relato',
            message: 'Olá mundo',
        });
    }
}

module.exports = EmailVerificationService;
