const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  messageId: { type: String, default: null },
  titre: { type: String, required: true },
  lot: { type: String, required: true },
  duree: { type: Number, required: true },
  finAt: { type: Date, required: true },
  maxParticipants: { type: Number, default: null },
  participants: { type: [String], default: [] },
  gagnant: { type: String, default: null },
  termine: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Giveaway', giveawaySchema);
