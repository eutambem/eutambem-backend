 module.exports = app => {
    const constants = app.routes.constants;
    
     app.get('/report/constants', (req, res) => res.json(constants));

     app.post('/report', function(req, res) { 
        const dbo = req.app.locals.dbs;
        const reportObj = req.body;
        dbo.collection("report").insertOne(reportObj, function(err, resdb) {
            if (err) throw err;
            res.send('1 report inserted');
        });
    });
    
    app.get('/report', function(req, res) {
        const dbo = req.app.locals.dbs;
        dbo.collection("report").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send({list : result});
        });
    });
}