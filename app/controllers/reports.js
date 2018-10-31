var Report = require('../models/reports');
const EmailVerificationService = require('../services/emailVerificationService');

function getBaseAPIURL(req) {
    return `${req.protocol}://${req.get('Host')}`;
}
module.exports.allReports = (req, res) => {
    Report.find({}, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ list: result });
    });
};

module.exports.newReport = (req, res) => {
    const reportObj = req.body;
    const dbo = req.app.locals.dbs;
    Report.create(reportObj, (err, result) => {
        if (err) throw err;
        const report = { ...reportObj, _id: result._id };
        const emailService = new EmailVerificationService({ db: dbo, baseURL: getBaseAPIURL(req) });
        emailService.sendVerificationEmail(report, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.status(200).json({ report: report });
        });
    });
};