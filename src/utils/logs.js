const { EmbedBuilder } = require('discord.js');
const Guild = require('../database/Guild');
const { colors } = require('../config/config');

async function envoyerLog(guild, typeSalon, embed) {
  try {
    const config = await Guild.findOne({ guildId: guild.id });
    if (!config) return;
    const salons = config.salons;
    let salondId = null;
    if (typeSalon === 'moderation') salondId = salons.logsModeration;
    else if (typeSalon === 'giveaway') salondId = salons.logsGiveaway;
    else if (typeSalon === 'niveaux') salondId = salons.logsNiveaux;
    if (!salondId) return;
    const salon = guild.channels.cache.get(salondId);
    if (salon) await salon.send({ embeds: [embed] });
  } catch (e) {
    console.error('Erreur log :', e);
  }
}

module.exports = { envoyerLog };
