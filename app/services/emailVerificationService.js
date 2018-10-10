const crypto = require('crypto');
const ses = require('node-ses');

class EmailVerificationService {
    constructor(options = {}) {
        if (!options.emailDriver) options.emailDriver = ses;
        this.emailDriver = options.emailDriver;
        this.db = options.db;
        this.from = process.env.EMAIL_FROM_ADDRESS;
    }

    sendVerificationEmail(report, callback) {
        const to = report.email;
        const from = this.from;
        const token = this.createToken(report);

        this.saveToken(token, report, (err) => {
            if (err) {
                callback(err);
                return;
            }

            this.emailDriver.createClient().sendEmail({
                to: to,
                from: from,
                subject: 'Verifique seu email pra enviar seu relato',
                message: 'Olá mundo',
            }, callback);
        });
    }

    saveToken(token, report, callback) {
        this.db.collection('validation_token').insertOne({
            report_id: report._id,
            token: token,
        }, callback);
    }

    createToken(report) {
        const tokenValue = report._id + Date.now();
        return crypto.createHash('sha256').update(tokenValue, 'utf8').digest('hex');
    }
}

module.exports = EmailVerificationService;
