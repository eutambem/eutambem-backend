const { verify } = require('../services/emailVerificationService');

module.exports = (app) => {
  const { constants } = app.routes;

  app.get('/report/constants', (req, res) => res.json(constants));

  app.post('/report', (req, res) => app.controllers.reports.newReport(req, res));

  app.get('/report', (req, res) => app.controllers.reports.allReports(req, res));

  app.get('/verify', (req, res) => {
    const { token } = req.query;

    console.log('Verifying with token ', token);
    verify(token, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err });
      }
      res.json({ message: 'Obrigado por verificar seu e-mail.' });
    });
  });
};
