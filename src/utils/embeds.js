const { EmbedBuilder } = require('discord.js');
const { colors } = require('../config/config');

module.exports = {
  embedMod: (titre, description, fields = []) => {
    const e = new EmbedBuilder()
      .setColor(colors.moderation)
      .setTitle(`🔵 ${titre}`)
      .setDescription(description)
      .setTimestamp();
    if (fields.length) e.addFields(fields);
    return e;
  },

  embedGiveaway: (titre, description, fields = []) => {
    const e = new EmbedBuilder()
      .setColor(colors.giveaway)
      .setTitle(`🎉 ${titre}`)
      .setDescription(description)
      .setTimestamp();
    if (fields.length) e.addFields(fields);
    return e;
  },

  embedLevel: (titre, description, fields = []) => {
    const e = new EmbedBuilder()
      .setColor(colors.levels)
      .setTitle(`🔴 ${titre}`)
      .setDescription(description)
      .setTimestamp();
    if (fields.length) e.addFields(fields);
    return e;
  },

  embedSuccess: (description) =>
    new EmbedBuilder().setColor(colors.success).setDescription(`✅ ${description}`),

  embedError: (description) =>
    new EmbedBuilder().setColor(colors.error).setDescription(`❌ ${description}`),
};
