const { SlashCommandBuilder } = require('discord.js');
const { embedMod } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Informations sur le serveur'),

  async execute(interaction) {
    const guild = interaction.guild;
    await guild.fetch();
    await interaction.reply({ embeds: [embedMod(
      guild.name,
      `> *Serveur Honored [👑]*`,
      [
        { name: '👑 Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 Membres', value: `${guild.memberCount}`, inline: true },
        { name: '📅 Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '💬 Salons', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🎭 Rôles', value: `${guild.roles.cache.size}`, inline: true },
        { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
      ]
    ).setThumbnail(guild.iconURL({ dynamic: true }))] });
  },
};
