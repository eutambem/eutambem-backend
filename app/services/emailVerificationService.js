const crypto = require('crypto');
const ses = require('node-ses');
const Report = require('../models/reports');
const { ValidationToken } = require('../models/reports');

const createToken = (report) => {
  const tokenValue = report._id + Date.now();
  return crypto.createHash('sha256').update(tokenValue, 'utf8').digest('hex');
};

const verificationURL = (token, baseURL) => `${baseURL}/verify?token=${token}`;

const saveToken = (token, report, callback) => {
  ValidationToken.create({
    reportId: report._id,
    token,
    date: new Date(Date.now()),
  }, callback);
};

const sendVerificationEmail = (report, callback, options = {}) => {
  const emailDriver = options.emailDriver || ses;
  const { baseURL } = options;
  const to = report.email;
  const from = `EuTambem <${process.env.EMAIL_FROM_ADDRESS}>`;
  const token = createToken(report);

  saveToken(token, report, (err) => {
    if (err) {
      callback(err);
      return;
    }

    emailDriver.createClient().sendEmail({
      to,
      from,
      subject: 'Verifique seu endereço de e-mail',
      message: `Olá,<br><br>Obrigado por enviar seu relato.<br><br>Para evitarmos spam, pedimos que por favor verifique seu email clicando <a href="${verificationURL(token, baseURL)}">aqui</a>.<br><br>Equipe EuTambem`,
    }, callback);
  });
};

const getReportFromToken = (token, callback) => {
  ValidationToken.findOne({ token }, (err, tokenObj) => {
    if (err || !tokenObj) {
      callback(err || 'Validation token not found');
      return;
    }

    Report.findById(tokenObj.reportId, (findError, report) => {
      if (findError || !report) {
        callback(findError || 'Report not found');
        return;
      }
      callback(findError, report, tokenObj);
    });
  });
};

const updateReportAsVerified = (report, callback) => {
  Report.findByIdAndUpdate(report._id, { emailVerified: true }, { }, callback);
};

const removeToken = (token, callback) => {
  ValidationToken.deleteOne({ _id: token._id }, callback);
};

const verify = (token, callback) => {
  getReportFromToken(token, (err, report, tokenObj) => {
    if (err) {
      callback(err);
      return;
    }

    updateReportAsVerified(report, (updateError) => {
      if (updateError) {
        callback(updateError);
        return;
      }

      removeToken(tokenObj, callback);
    });
  });
};

module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.verify = verify;
