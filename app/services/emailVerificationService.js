const crypto = require('crypto');
const ses = require('node-ses');

class EmailVerificationService {
  constructor(options = {}) {
    this.emailDriver = options.emailDriver || ses;
    this.db = options.db;
    this.baseURL = options.baseURL;
    this.from = `EuTambem <${process.env.EMAIL_FROM_ADDRESS}>`;
  }

  sendVerificationEmail(report, callback) {
    const to = report.email;
    const { from } = this;
    const token = this.createToken(report);
    const verificationURL = this.verificationURL(token);

    this.saveToken(token, report, (err) => {
      if (err) {
        callback(err);
        return;
      }

      this.emailDriver.createClient().sendEmail({
        to,
        from,
        subject: 'Verifique seu endereço de e-mail',
        message: `Olá,<br><br>Obrigado por enviar seu relato.<br><br>Para evitarmos spam, pedimos que por favor verifique seu email clicando <a href="${verificationURL}">aqui</a>.<br><br>Equipe EuTambem`,
      }, callback);
    });
  }

  verify(token, callback) {
    this.getReportFromToken(token, (err, report, tokenObj) => {
      if (err) {
        callback(err);
        return;
      }

      this.updateReportAsVerified(report, (updateError) => {
        if (updateError) {
          callback(updateError);
          return;
        }

        this.removeToken(tokenObj, callback);
      });
    });
  }

  getReportFromToken(token, callback) {
    this.db.collection('validation_token').findOne({ token }, (err, tokenObj) => {
      if (err || !tokenObj) {
        callback(err || 'Validation token not found');
        return;
      }

      this.db.collection('report').findOne({ _id: tokenObj.report_id }, (findError, report) => {
        if (findError || !report) {
          callback(findError || 'Report not found');
          return;
        }
        callback(findError, report, tokenObj);
      });
    });
  }

  updateReportAsVerified(report, callback) {
    this.db.collection('report').updateOne(
      { _id: report._id },
      { $set: { emailVerified: true } },
      { },
      callback,
    );
  }

  saveToken(token, report, callback) {
    this.db.collection('validation_token').insertOne({
      report_id: report._id,
      token,
      date: new Date(Date.now()),
    }, callback);
  }

  removeToken(token, callback) {
    this.db.collection('validation_token').deleteOne({ _id: token._id }, callback);
  }

  createToken(report) { // eslint-disable-line class-methods-use-this
    const tokenValue = report._id + Date.now();
    return crypto.createHash('sha256').update(tokenValue, 'utf8').digest('hex');
  }

  verificationURL(token) {
    return `${this.baseURL}/verify?token=${token}`;
  }
}

module.exports = EmailVerificationService;
