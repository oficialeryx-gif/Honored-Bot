const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod, embedError } = require('../../utils/embeds');
const { envoyerLog } = require('../../utils/logs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un membre du serveur')
    .addUserOption(o => o.setName('membre').setDescription('Le membre à expulser').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison de l\'expulsion'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const membre = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';

    if (!membre) return interaction.reply({ embeds: [embedError('Membre introuvable.')], ephemeral: true });
    if (!membre.kickable) return interaction.reply({ embeds: [embedError('Je ne peux pas expulser ce membre.')], ephemeral: true });

    await membre.kick(raison);

    const embed = embedMod('Membre Expulsé', `**${membre.user.tag}** a été expulsé du serveur.`, [
      { name: '👤 Membre', value: `<@${membre.id}>`, inline: true },
      { name: '🛡️ Modérateur', value: `<@${interaction.user.id}>`, inline: true },
      { name: '📝 Raison', value: raison, inline: false },
    ]);

    await interaction.reply({ embeds: [embed] });
    await envoyerLog(interaction.guild, 'moderation', embed);
  },
};
