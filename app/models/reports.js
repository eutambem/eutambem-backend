const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

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
  emailVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Report', reportSchema);

const validationTokenSchema = new Schema({
  reportId: { type: ObjectId, required: true },
  token: { type: String, required: true },
  date: { type: Date, required: true },
}, { collection: 'validation_tokens' });

module.exports.ValidationToken = mongoose.model('ValidationToken', validationTokenSchema);
