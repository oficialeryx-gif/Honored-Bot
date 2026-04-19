const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedLevel, embedError } = require('../../utils/embeds');
const { fleaux } = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quete')
    .setDescription('Lancer une quête contre un Fléau'),

  async execute(interaction) {
    const liste = fleaux.map((f, i) =>
      `**${i + 1}.** ${f.difficulte} ${f.nom}\n> Récompense : \`${f.recompense} EO\` + \`${f.xp} XP\``
    ).join('\n\n');

    const rows = [];
    const chunks = [fleaux.slice(0, 3), fleaux.slice(3)];
    for (const chunk of chunks) {
      if (!chunk.length) continue;
      const row = new ActionRowBuilder();
      for (const f of chunk) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`quete_${f.nom}`)
            .setLabel(f.nom)
            .setStyle(ButtonStyle.Danger)
        );
      }
      rows.push(row);
    }

    await interaction.reply({
      embeds: [embedLevel('⚔️ Tableau des Fléaux', liste + '\n\n*Choisis ton adversaire ci-dessous :*')],
      components: rows,
    });
  },
};
