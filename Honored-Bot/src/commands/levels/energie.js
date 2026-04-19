const { SlashCommandBuilder } = require('discord.js');
const { embedLevel } = require('../../utils/embeds');
const User = require('../../database/User');
const { economie } = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('energie')
    .setDescription('Voir ton solde d\'Énergies Occultes'),

  async execute(interaction) {
    const userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guildId });
    const solde = userData?.energies || 0;
    await interaction.reply({ embeds: [embedLevel(
      '💎 Énergies Occultes',
      `Tu possèdes **${solde.toLocaleString()} ${economie.abreviation}**.`
    )] });
  },
};
