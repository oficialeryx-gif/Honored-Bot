const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod } = require('../../utils/embeds');
const Guild = require('../../database/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Définir le rôle automatique à l\'arrivée')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(o => o.setName('role').setDescription('Rôle à attribuer (vide pour désactiver)')),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    await Guild.findOneAndUpdate(
      { guildId: interaction.guildId },
      { $set: { 'roles.autoRole': role ? role.id : null } },
      { upsert: true }
    );
    const msg = role ? `L'autorole est maintenant <@&${role.id}>.` : 'L\'autorole a été désactivé.';
    await interaction.reply({ embeds: [embedMod('Autorole', msg)] });
  },
};
