const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedGiveaway, embedError } = require('../../utils/embeds');
const Guild = require('../../database/Guild');
const { economie } = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shoptickets')
    .setDescription('Envoyer/mettre à jour le message permanent du shop de tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = await Guild.findOne({ guildId: interaction.guildId });
    if (!config?.salons?.shopTickets) return interaction.reply({ embeds: [embedError('Configure d\'abord le salon shop avec `/setup shop`.')], ephemeral: true });

    const salon = interaction.guild.channels.cache.get(config.salons.shopTickets);
    if (!salon) return interaction.reply({ embeds: [embedError('Salon shop introuvable.')], ephemeral: true });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('shop_acheter_ticket')
        .setLabel('🟣 Acheter un ticket')
        .setStyle(ButtonStyle.Primary)
    );

    const embed = embedGiveaway(
      '🎟️ Shop des Tickets',
      `Dépensez **${economie.coutTicket} ${economie.abreviation}** pour obtenir **1 ticket de giveaway**.\n\nChaque ticket vous permet de participer à **un giveaway en cours**. Cliquez sur le bouton ci-dessous pour acheter !`
    );

    const msg = await salon.send({ embeds: [embed], components: [row] });

    await Guild.findOneAndUpdate({ guildId: interaction.guildId }, { shopMessageId: msg.id });
    await interaction.reply({ embeds: [embedGiveaway('Shop Envoyé', `Le message du shop a été envoyé dans <#${salon.id}>.`)], ephemeral: true });
  },
};
