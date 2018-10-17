var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const reportSchema = new Schema({
    establishment: {
        value: String,
        label: String
    },
    harassmentType: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    followupActions: [{action: String}],
    wouldRecommend: { type: String, required: true },
    advice: String,
    gender: { type: String, required: true },
    skinColor: { type: String, required: true },
    age: Number,
    wage: String,
    email: { type: String, required: true },
    name: String 
});

module.exports = mongoose.model('Report', reportSchema);