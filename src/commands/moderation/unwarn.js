const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod, embedError } = require('../../utils/embeds');
const User = require('../../database/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('Retirer le dernier avertissement d\'un membre')
    .addUserOption(o => o.setName('membre').setDescription('Le membre').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const membre = interaction.options.getMember('membre');
    if (!membre) return interaction.reply({ embeds: [embedError('Membre introuvable.')], ephemeral: true });

    const userData = await User.findOneAndUpdate(
      { userId: membre.id, guildId: interaction.guildId },
      { $pop: { warns: 1 } },
      { new: true }
    );

    if (!userData) return interaction.reply({ embeds: [embedError('Cet utilisateur n\'a pas d\'avertissements.')], ephemeral: true });

    await interaction.reply({ embeds: [embedMod('Avertissement Retiré', `Le dernier avertissement de <@${membre.id}> a été supprimé.\n**Avertissements restants :** ${userData.warns.length}/3`)] });
  },
};
