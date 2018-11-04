const Report = require('../models/reports');
const EmailVerificationService = require('../services/emailVerificationService');
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
  const dbo = req.app.locals.dbs;

  encryptUserData(reportObj).then((encryptedReport) => {
    Report.create({ ...encryptedReport, emailVerified: false }, (errorSaving, result) => {
      if (errorSaving) throw errorSaving;
      const report = { ...reportObj, _id: result._id };
      const emailService = new EmailVerificationService({ db: dbo, baseURL: getBaseAPIURL(req) });
      emailService.sendVerificationEmail(report, (err) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return res.status(200).json({ report });
      });
    });
  }).catch(() => res.status(500).json({ error: 'It was not possible to secure user data at this time' }));
};
