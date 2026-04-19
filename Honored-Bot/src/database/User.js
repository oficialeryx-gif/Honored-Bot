const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  niveau: { type: Number, default: 0 },
  energies: { type: Number, default: 0 },
  tickets: { type: Number, default: 0 },
  fleauxVaincus: { type: Number, default: 0 },
  warns: { type: Array, default: [] },
  blacklisted: { type: Boolean, default: false },
  derniereActivite: { type: Date, default: null },
});

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
