const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod, embedError } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprimer des messages en masse')
    .addIntegerOption(o => o.setName('nombre').setDescription('Nombre de messages à supprimer (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const nombre = interaction.options.getInteger('nombre');
    const deleted = await interaction.channel.bulkDelete(nombre, true).catch(() => null);
    if (!deleted) return interaction.reply({ embeds: [embedError('Impossible de supprimer les messages (trop anciens ou erreur).')], ephemeral: true });
    await interaction.reply({ embeds: [embedMod('Messages Supprimés', `**${deleted.size}** message(s) ont été supprimés.`)], ephemeral: true });
  },
};
