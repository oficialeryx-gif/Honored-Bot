const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod, embedError } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Retirer le silence d\'un membre')
    .addUserOption(o => o.setName('membre').setDescription('Le membre à démute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const membre = interaction.options.getMember('membre');
    if (!membre) return interaction.reply({ embeds: [embedError('Membre introuvable.')], ephemeral: true });
    await membre.timeout(null);
    await interaction.reply({ embeds: [embedMod('Silence Retiré', `Le silence de <@${membre.id}> a été levé.`)] });
  },
};
