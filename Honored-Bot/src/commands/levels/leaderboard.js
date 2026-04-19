const { SlashCommandBuilder } = require('discord.js');
const { embedLevel } = require('../../utils/embeds');
const User = require('../../database/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Classement des membres du serveur')
    .addStringOption(o => o.setName('type').setDescription('Type de classement').addChoices(
      { name: 'Niveaux', value: 'niveau' },
      { name: 'Énergies Occultes', value: 'energies' },
    )),

  async execute(interaction) {
    const type = interaction.options.getString('type') || 'niveau';
    const tri = type === 'niveau' ? { niveau: -1, xp: -1 } : { energies: -1 };
    const top = await User.find({ guildId: interaction.guildId }).sort(tri).limit(10);

    if (!top.length) return interaction.reply({ embeds: [embedLevel('Classement', 'Aucune donnée disponible pour l\'instant.')] });

    const liste = top.map((u, i) => {
      const medaille = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
      const val = type === 'niveau' ? `Niv. ${u.niveau}` : `${u.energies.toLocaleString()} EO`;
      return `${medaille} <@${u.userId}> — ${val}`;
    }).join('\n');

    const titre = type === 'niveau' ? 'Classement des Niveaux' : 'Classement des Énergies Occultes';
    await interaction.reply({ embeds: [embedLevel(`👑 ${titre}`, liste)] });
  },
};
