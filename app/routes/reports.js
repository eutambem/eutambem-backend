const EmailVerificationService = require('../services/emailVerificationService');

function getBaseAPIURL(req) {
    return `${req.protocol}://${req.get('Host')}`;
}

module.exports = app => {
    const constants = app.routes.constants;
    
     app.get('/report/constants', (req, res) => res.json(constants));

     app.post('/report', function(req, res) { 
        const dbo = req.app.locals.dbs;
        const reportObj = req.body;
        dbo.collection("report").insertOne(reportObj, function(err, result) {
            if (err) throw err;
            const report = { ...reportObj, _id: result.insertedId };
            const emailService = new EmailVerificationService({ db: dbo, baseURL: getBaseAPIURL(req) });
            emailService.sendVerificationEmail(report, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: err });
                }
                res.send('1 report inserted');
            });
        });
    });
    
    app.get('/report', function(req, res) {
        const dbo = req.app.locals.dbs;
        dbo.collection("report").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send({list : result});
        });
    });

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