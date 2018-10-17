var expect = require('chai').expect;
var Report = require('../../app/models/reports');

describe('Report', function() {
    it('should be invalid when required fields are empty', function(done) {
        var report = new Report();
 
        report.validate(function(err) {
            expect(err.errors.harassmentType).to.exist;
            expect(err.errors.description).to.exist;
            expect(err.errors.date).to.exist;
            expect(err.errors.wouldRecommend).to.exist;
            expect(err.errors.gender).to.exist;
            expect(err.errors.skinColor).to.exist;
            expect(err.errors.email).to.exist;
            done();
        });
    });
});