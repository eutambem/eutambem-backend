module.exports = app => {
    app.get('/health-check', (req, res) => res.json({status : 'It\'s alive'}));
}