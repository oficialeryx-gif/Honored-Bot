const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedGiveaway, embedError } = require('../../utils/embeds');
const Giveaway = require('../../database/Giveaway');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Gérer les giveaways')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub => sub
      .setName('create')
      .setDescription('Créer un giveaway')
      .addStringOption(o => o.setName('titre').setDescription('Titre du giveaway').setRequired(true))
      .addStringOption(o => o.setName('lot').setDescription('Lot / Récompense').setRequired(true))
      .addStringOption(o => o.setName('duree').setDescription('Durée (ex: 1h, 2d, 30m)').setRequired(true))
      .addChannelOption(o => o.setName('salon').setDescription('Salon où poster le giveaway').setRequired(true))
      .addIntegerOption(o => o.setName('max').setDescription('Nombre maximum de participants'))
    )
    .addSubcommand(sub => sub
      .setName('end')
      .setDescription('Terminer un giveaway manuellement')
      .addStringOption(o => o.setName('id').setDescription('ID du giveaway').setRequired(true))
    )
    .addSubcommand(sub => sub
      .setName('reroll')
      .setDescription('Retirer un nouveau gagnant')
      .addStringOption(o => o.setName('id').setDescription('ID du giveaway').setRequired(true))
    )
    .addSubcommand(sub => sub
      .setName('list')
      .setDescription('Lister les giveaways en cours')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'create') {
      const titre = interaction.options.getString('titre');
      const lot = interaction.options.getString('lot');
      const dureeStr = interaction.options.getString('duree');
      const salon = interaction.options.getChannel('salon');
      const max = interaction.options.getInteger('max');
      const dureeMs = ms(dureeStr);

      if (!dureeMs) return interaction.reply({ embeds: [embedError('Durée invalide.')], ephemeral: true });

      const finAt = new Date(Date.now() + dureeMs);

      const giveaway = await Giveaway.create({
        guildId: interaction.guildId,
        channelId: salon.id,
        titre, lot,
        duree: dureeMs,
        finAt,
        maxParticipants: max,
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`giveaway_participer_${giveaway._id}`)
          .setLabel('🟢 Participer !')
          .setStyle(ButtonStyle.Success)
      );

      const embed = embedGiveaway(titre,
        `**🎁 Lot :** ${lot}\n**⏱️ Fin :** <t:${Math.floor(finAt.getTime() / 1000)}:R>\n**👥 Participants :** 0${max ? ` / ${max}` : ''}\n\n*Utilisez un ticket pour participer !*`,
        [{ name: '🎟️ Comment participer ?', value: 'Achetez un ticket dans le salon shop, puis cliquez sur le bouton ci-dessous.' }]
      );

      const msg = await salon.send({ embeds: [embed], components: [row] });
      giveaway.messageId = msg.id;
      await giveaway.save();

      await interaction.reply({ embeds: [embedGiveaway('Giveaway Créé !', `Le giveaway **${titre}** a été lancé dans <#${salon.id}> !\nID : \`${giveaway._id}\``)], ephemeral: true });

      // Timer automatique
      setTimeout(async () => {
        await terminerGiveaway(giveaway._id, interaction.guild);
      }, dureeMs);
    }

    else if (sub === 'end') {
      const id = interaction.options.getString('id');
      await terminerGiveaway(id, interaction.guild);
      await interaction.reply({ embeds: [embedGiveaway('Giveaway Terminé', `Le giveaway \`${id}\` a été terminé manuellement.`)], ephemeral: true });
    }

    else if (sub === 'reroll') {
      const id = interaction.options.getString('id');
      const giveaway = await Giveaway.findById(id);
      if (!giveaway || !giveaway.termine) return interaction.reply({ embeds: [embedError('Giveaway introuvable ou non terminé.')], ephemeral: true });
      if (!giveaway.participants.length) return interaction.reply({ embeds: [embedError('Aucun participant.')], ephemeral: true });

      const gagnant = giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)];
      const salon = interaction.guild.channels.cache.get(giveaway.channelId);
      if (salon) await salon.send({ embeds: [embedGiveaway('🎲 Nouveau Tirage !', `Le nouveau gagnant est <@${gagnant}> ! Félicitations !`)] });
      await interaction.reply({ embeds: [embedGiveaway('Reroll effectué', `Nouveau gagnant : <@${gagnant}>`)], ephemeral: true });
    }

    else if (sub === 'list') {
      const actifs = await Giveaway.find({ guildId: interaction.guildId, termine: false });
      if (!actifs.length) return interaction.reply({ embeds: [embedGiveaway('Giveaways en cours', 'Aucun giveaway actif pour le moment.')], ephemeral: true });

      const liste = actifs.map(g =>
        `• **${g.titre}** — Fin <t:${Math.floor(g.finAt.getTime() / 1000)}:R> — ID : \`${g._id}\``
      ).join('\n');

      await interaction.reply({ embeds: [embedGiveaway('🎉 Giveaways en Cours', liste)], ephemeral: true });
    }
  },
};

async function terminerGiveaway(id, guild) {
  const giveaway = await Giveaway.findById(id);
  if (!giveaway || giveaway.termine) return;

  giveaway.termine = true;

  const salon = guild.channels.cache.get(giveaway.channelId);

  if (!giveaway.participants.length) {
    giveaway.gagnant = null;
    await giveaway.save();
    if (salon) await salon.send({ embeds: [embedGiveaway('🎉 Giveaway Terminé', `**${giveaway.titre}** — Aucun participant. Pas de gagnant.`)] });
    return;
  }

  const gagnantId = giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)];
  giveaway.gagnant = gagnantId;
  await giveaway.save();

  if (salon) {
    await salon.send({
      content: `<@${gagnantId}>`,
      embeds: [embedGiveaway('🏆 Giveaway Terminé !',
        `Le gagnant du giveaway **${giveaway.titre}** est <@${gagnantId}> !\n\n**🎁 Lot :** ${giveaway.lot}`
      )]
    });

    // Mise à jour du message original
    try {
      const msg = await salon.messages.fetch(giveaway.messageId);
      if (msg) {
        await msg.edit({
          embeds: [embedGiveaway(`${giveaway.titre} — TERMINÉ`, `**Gagnant :** <@${gagnantId}>\n**🎁 Lot :** ${giveaway.lot}`)],
          components: []
        });
      }
    } catch (_) {}

    // DM au gagnant
    try {
      const gagnantUser = await guild.members.fetch(gagnantId);
      await gagnantUser.send({ embeds: [embedGiveaway('🎉 Félicitations !', `Tu as remporté le giveaway **${giveaway.titre}** sur **${guild.name}** !\n**🎁 Lot :** ${giveaway.lot}`)] });
    } catch (_) {}
  }
}

module.exports.terminerGiveaway = terminerGiveaway;
