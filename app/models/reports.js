const mongoose = require('mongoose');

const { Schema } = mongoose;

const reportSchema = new Schema({
  establishment: { type: { value: String, label: String }, required: true },
  harassmentType: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  followupActions: [String],
  wouldRecommend: { type: String, required: true },
  advice: String,
  gender: { type: String, required: true },
  skinColor: { type: String, required: true },
  age: Number,
  wage: String,
  email: { type: String, required: true, select: false },
  sexualOrientation: { type: String, required: true },
  name: { type: String, select: false },
});

module.exports = mongoose.model('Report', reportSchema);
