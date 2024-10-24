const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ruleSchema = new Schema({
  ruleName: { type: String, required: true, unique: true, trim: true },
  ruleAST: { type: Object, required: true },
  createdBy: { type: String, required: true, trim: true },
  version: { type: Number, default: 1 },
  lastModified: { type: Date, default: Date.now }
}, { timestamps: true });

const Rule = mongoose.model('Rule', ruleSchema);
module.exports = Rule;
