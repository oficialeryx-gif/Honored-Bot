const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { embedMod, embedError } = require('../../utils/embeds');
const Guild = require('../../database/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configurer les salons du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub => sub.setName('niveaux').setDescription('Salon des messages de niveau').addChannelOption(o => o.setName('salon').setDescription('Salon').setRequired(true)))
    .addSubcommand(sub => sub.setName('shop').setDescription('Salon du shop de tickets').addChannelOption(o => o.setName('salon').setDescription('Salon').setRequired(true)))
    .addSubcommand(sub => sub.setName('logs-moderation').setDescription('Salon des logs de modération').addChannelOption(o => o.setName('salon').setDescription('Salon').setRequired(true)))
    .addSubcommand(sub => sub.setName('logs-giveaway').setDescription('Salon des logs de giveaway').addChannelOption(o => o.setName('salon').setDescription('Salon').setRequired(true)))
    .addSubcommand(sub => sub.setName('welcome').setDescription('Salon de bienvenue').addChannelOption(o => o.setName('salon').setDescription('Salon').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const salon = interaction.options.getChannel('salon');

    const update = {};
    if (sub === 'niveaux') update['salons.niveaux'] = salon.id;
    else if (sub === 'shop') update['salons.shopTickets'] = salon.id;
    else if (sub === 'logs-moderation') update['salons.logsModeration'] = salon.id;
    else if (sub === 'logs-giveaway') update['salons.logsGiveaway'] = salon.id;
    else if (sub === 'welcome') update['salons.welcome'] = salon.id;

    await Guild.findOneAndUpdate({ guildId: interaction.guildId }, { $set: update }, { upsert: true });
    await interaction.reply({ embeds: [embedMod('Configuration Sauvegardée', `Le salon <#${salon.id}> a été configuré pour **${sub}**.`)] });
  },
};
