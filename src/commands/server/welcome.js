const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod } = require('../../utils/embeds');
const Guild = require('../../database/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configurer le message de bienvenue')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('message').setDescription('Message ({user} = mention du membre)').setRequired(true))
    .addBooleanOption(o => o.setName('actif').setDescription('Activer ou désactiver').setRequired(true)),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const actif = interaction.options.getBoolean('actif');

    await Guild.findOneAndUpdate(
      { guildId: interaction.guildId },
      { $set: { 'welcome.message': message, 'welcome.actif': actif } },
      { upsert: true }
    );

    await interaction.reply({ embeds: [embedMod('Bienvenue Configuré', `Message : ${message}\nStatut : ${actif ? '✅ Actif' : '❌ Inactif'}`)] });
  },
};
