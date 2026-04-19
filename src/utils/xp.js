const User = require('../database/User');
const Guild = require('../database/Guild');
const { xp: xpConfig } = require('../config/config');
const { embedLevel } = require('./embeds');

async function ajouterXP(member, guild, client) {
  const data = await User.findOneAndUpdate(
    { userId: member.id, guildId: guild.id },
    { $inc: { xp: xpConfig.parMessage } },
    { upsert: true, new: true }
  );

  const xpNecessaire = xpConfig.xpParNiveau(data.niveau);
  if (data.xp >= xpNecessaire) {
    data.xp -= xpNecessaire;
    data.niveau += 1;
    await data.save();

    const config = await Guild.findOne({ guildId: guild.id });
    if (config?.salons?.niveaux) {
      const salon = guild.channels.cache.get(config.salons.niveaux);
      if (salon) {
        await salon.send({
          content: `<@${member.id}>`,
          embeds: [embedLevel(
            '✨ Niveau supérieur !',
            `**${member.displayName}** vient d'atteindre le **niveau ${data.niveau}** !`,
            [{ name: '⚡ Niveau atteint', value: `\`${data.niveau}\``, inline: true }]
          )]
        });
      }
    }
  }
}

module.exports = { ajouterXP };
