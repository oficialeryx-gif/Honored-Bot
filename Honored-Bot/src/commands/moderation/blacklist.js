const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod } = require('../../utils/embeds');
const User = require('../../database/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Blacklister ou retirer du blacklist un utilisateur')
    .addUserOption(o => o.setName('membre').setDescription('Le membre').setRequired(true))
    .addBooleanOption(o => o.setName('statut').setDescription('true = blacklist, false = retirer').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const membre = interaction.options.getUser('membre');
    const statut = interaction.options.getBoolean('statut');
    await User.findOneAndUpdate(
      { userId: membre.id, guildId: interaction.guildId },
      { blacklisted: statut },
      { upsert: true }
    );
    const msg = statut ? `<@${membre.id}> a été **blacklisté** du bot.` : `<@${membre.id}> a été **retiré** du blacklist.`;
    await interaction.reply({ embeds: [embedMod('Blacklist', msg)] });
  },
};
