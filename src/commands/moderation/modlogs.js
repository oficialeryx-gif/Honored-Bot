const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod, embedError } = require('../../utils/embeds');
const User = require('../../database/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modlogs')
    .setDescription('Voir l\'historique de modération d\'un utilisateur')
    .addUserOption(o => o.setName('membre').setDescription('Le membre').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const membre = interaction.options.getUser('membre');
    const userData = await User.findOne({ userId: membre.id, guildId: interaction.guildId });

    if (!userData || userData.warns.length === 0) {
      return interaction.reply({ embeds: [embedMod('Historique de Modération', `<@${membre.id}> n'a aucun avertissement.`)] });
    }

    const liste = userData.warns.map((w, i) =>
      `**${i + 1}.** ${w.raison} — par <@${w.modId}> le <t:${Math.floor(new Date(w.date).getTime() / 1000)}:D>`
    ).join('\n');

    await interaction.reply({ embeds: [embedMod(
      `Historique — ${membre.tag}`,
      liste,
      [{ name: '⚠️ Total avertissements', value: `${userData.warns.length}/3`, inline: true }]
    )] });
  },
};
