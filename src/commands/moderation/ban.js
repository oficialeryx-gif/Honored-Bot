const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod, embedError } = require('../../utils/embeds');
const { envoyerLog } = require('../../utils/logs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre du serveur')
    .addUserOption(o => o.setName('membre').setDescription('Le membre à bannir').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison du bannissement'))
    .addIntegerOption(o => o.setName('jours').setDescription('Jours de messages supprimés (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const membre = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    const jours = interaction.options.getInteger('jours') || 0;

    if (!membre) return interaction.reply({ embeds: [embedError('Membre introuvable.')], ephemeral: true });
    if (!membre.bannable) return interaction.reply({ embeds: [embedError('Je ne peux pas bannir ce membre.')], ephemeral: true });

    await membre.ban({ deleteMessageDays: jours, reason: raison });

    const embed = embedMod('Membre Banni', `**${membre.user.tag}** a été banni du serveur.`, [
      { name: '👤 Membre', value: `<@${membre.id}>`, inline: true },
      { name: '🛡️ Modérateur', value: `<@${interaction.user.id}>`, inline: true },
      { name: '📝 Raison', value: raison, inline: false },
    ]);

    await interaction.reply({ embeds: [embed] });
    await envoyerLog(interaction.guild, 'moderation', embed);
  },
};
