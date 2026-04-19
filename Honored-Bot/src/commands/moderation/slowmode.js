const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Définir le mode lent du salon')
    .addIntegerOption(o => o.setName('secondes').setDescription('Délai en secondes (0 = désactiver)').setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const secondes = interaction.options.getInteger('secondes');
    await interaction.channel.setRateLimitPerUser(secondes);
    const msg = secondes === 0 ? 'Mode lent **désactivé**.' : `Mode lent défini à **${secondes} secondes**.`;
    await interaction.reply({ embeds: [embedMod('Mode Lent', msg)] });
  },
};
