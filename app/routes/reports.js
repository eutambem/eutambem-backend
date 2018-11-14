module.exports = (app) => {
  const { constants } = app.routes;

  app.get('/report/constants', (req, res) => res.json(constants));

  app.post('/report', (req, res) => app.controllers.reports.newReport(req, res));

  app.get('/report', (req, res) => app.controllers.reports.allReports(req, res));

  app.get('/verify', (req, res) => app.controllers.reports.verify(req, res));
};
