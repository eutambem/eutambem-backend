const EmailVerificationService = require('../services/emailVerificationService');

function getBaseAPIURL(req) {
    return `${req.protocol}://${req.get('Host')}`;
}

module.exports = app => {
    const constants = app.routes.constants;

    app.get('/report/constants', (req, res) => res.json(constants));

    app.post('/report', (req, res) => app.controllers.reports.newReport(req, res));

    app.get('/report', (req, res) => app.controllers.reports.allReports(req, res));

    app.get('/verify', function(req, res) {
        const dbo = req.app.locals.dbs;
        const token = req.query.token;
        const emailService = new EmailVerificationService({ db: dbo, baseURL: getBaseAPIURL(req) });

        console.log('Verifying with token ', token);
        emailService.verify(token, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: err });
            }
            res.json({ message: 'Obrigado por verificar seu e-mail.' });
        });
    });
}