const crypto = require('crypto');
const ses = require('node-ses');

class EmailVerificationService {
    constructor(options = {}) {
        if (!options.emailDriver) options.emailDriver = ses;
        this.emailDriver = options.emailDriver;
        this.db = options.db;
        this.baseURL = options.baseURL;
        this.from = process.env.EMAIL_FROM_ADDRESS;
    }

    sendVerificationEmail(report, callback) {
        const to = report.email;
        const from = this.from;
        const token = this.createToken(report);
        const verificationURL = this.verificationURL(token);

        this.saveToken(token, report, (err) => {
            if (err) {
                callback(err);
                return;
            }

            this.emailDriver.createClient().sendEmail({
                to: to,
                from: from,
                subject: 'Verifique seu endereço de e-mail',
                message: `Olá,<br><br>Obrigado por enviar seu relato.<br><br>Para evitarmos spam, pedimos que por favor verifique seu email clicando <a href="${verificationURL}">aqui</a>.<br><br>Equipe EuTambem`,
            }, callback);
        });
    }

    verify(token, callback) {
        this.getReportFromToken(token, (err, report) => {
            this.updateReportAsVerified(report, callback);
        });
    }

    getReportFromToken(token, callback) {
         this.db.collection('validation_token').find({ token: token }, (err, tokenObj) => {
            if (err) {
                callback(err);
                return;
            }

            this.db.collection('report').find({ _id: tokenObj.report_id }, callback);
         });
    }

    updateReportAsVerified(report, callback) {
        this.db.collection('report').save({ ...report, emailVerified: true }, callback);
    }

    saveToken(token, report, callback) {
        this.db.collection('validation_token').insertOne({
            report_id: report._id,
            token: token,
            date: new Date(Date.now()),
        }, callback);
    }

    createToken(report) {
        const tokenValue = report._id + Date.now();
        return crypto.createHash('sha256').update(tokenValue, 'utf8').digest('hex');
    }

    verificationURL(token) {
        return `${this.baseURL}/verify?token=${token}`;
    }
}

module.exports = EmailVerificationService;
