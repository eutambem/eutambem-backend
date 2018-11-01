/* eslint no-unused-expressions: 0 */
const { expect } = require('chai');
const Report = require('../../app/models/reports');

describe('Report', () => {
  it('should be invalid when required fields are empty', (done) => {
    const report = new Report();

    report.validate((err) => {
      expect(err.errors.establishment).to.exist;
      expect(err.errors.harassmentType).to.exist;
      expect(err.errors.description).to.exist;
      expect(err.errors.date).to.exist;
      expect(err.errors.wouldRecommend).to.exist;
      expect(err.errors.gender).to.exist;
      expect(err.errors.skinColor).to.exist;
      expect(err.errors.email).to.exist;
      expect(err.errors.sexualOrientation).to.exist;
      done();
    });
  });
});
