const Report = require('../models/reports');
const { sendVerificationEmail, verify } = require('../services/emailVerificationService');
const { encryptUserData } = require('../services/encryptionService');

function getBaseAPIURL(req) {
  return `${req.protocol}://${req.get('Host')}`;
}

module.exports.allReports = (req, res) => {
  Report.find({}, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ list: result });
  });
};

module.exports.newReport = (req, res) => {
  const reportObj = req.body;

  encryptUserData(reportObj).then((encryptedReport) => {
    Report.create({ ...encryptedReport, emailVerified: false }, (errorSaving, result) => {
      if (errorSaving) throw errorSaving;
      const report = { ...reportObj, _id: result._id };
      sendVerificationEmail(report, (err) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return res.status(200).json({ report });
      }, { baseURL: getBaseAPIURL(req) });
    });
  }).catch(() => res.status(500).json({ error: 'It was not possible to secure user data at this time' }));
};

module.exports.verify = (req, res) => {
  const { token } = req.query;

  console.log('Verifying with token ', token);
  verify(token, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
    res.json({ message: 'Obrigado por verificar seu e-mail.' });
  });
};
