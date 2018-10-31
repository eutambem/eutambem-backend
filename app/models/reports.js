const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const establishmentSchema = new Schema({ value: String, label: String });
const followupActions = new Schema({ action: String });

const reportSchema = new Schema({
    establishment: { type: establishmentSchema, required: true },
    harassmentType: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    followupActions: [ followupActions ],
    wouldRecommend: { type: String, required: true },
    advice: String,
    gender: { type: String, required: true },
    skinColor: { type: String, required: true },
    age: Number,
    wage: String,
    email: { type: String, required: true },
    sexualOrientation: { type: String, required: true },
    name: String
});

module.exports = mongoose.model('Report', reportSchema);