const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  salons: {
    niveaux: { type: String, default: null },
    shopTickets: { type: String, default: null },
    logsModeration: { type: String, default: null },
    logsGiveaway: { type: String, default: null },
    logsNiveaux: { type: String, default: null },
    welcome: { type: String, default: null },
    leave: { type: String, default: null },
  },
  roles: {
    autoRole: { type: String, default: null },
  },
  welcome: {
    message: { type: String, default: 'Bienvenue sur le serveur {user} !' },
    actif: { type: Boolean, default: false },
  },
  motsInterdits: { type: [String], default: [] },
  shopMessageId: { type: String, default: null },
});

module.exports = mongoose.model('Guild', guildSchema);
