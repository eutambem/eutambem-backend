 module.exports = app => {
    const constants = app.routes.constants;
    
     app.get('/report/constants', (req, res) => res.json(constants));

     app.post('/report', function(req, res) { 
        const reportObj = req.body;
        let mongoUtil = app.db.connectionFactory;
        mongoUtil.connectToServer(function(err, db) {
            dbo = mongoUtil.getDb();
            dbo.collection("report").insertOne(reportObj, function(err, resdb) {
                if (err) throw err;
                res.send('1 report inserted');
                db.close();
            });
        });
    });
    
    app.get('/report', function(req, res) {
        let mongoUtil = app.db.connectionFactory;
        mongoUtil.connectToServer(function(err, db) {
            dbo = mongoUtil.getDb();
            dbo.collection("report").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send({list : result});
            db.close();
            });
        });
    });
}