const { embedError, embedGiveaway, embedLevel } = require('../utils/embeds');
const User = require('../database/User');
const Giveaway = require('../database/Giveaway');
const { economie, fleaux } = require('../config/config');

module.exports = async function handleButton(interaction, client) {
  const id = interaction.customId;

  // ─── SHOP : Acheter un ticket ───
  if (id === 'shop_acheter_ticket') {
    await interaction.deferReply({ ephemeral: true });

    const userData = await User.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guildId },
      {},
      { upsert: true, new: true }
    );

    if (userData.energies < economie.coutTicket) {
      return interaction.editReply({ embeds: [embedError(`Tu n'as pas assez d'Énergies Occultes. Il te faut **${economie.coutTicket} EO** (tu en possèdes **${userData.energies}**).`)] });
    }

    await User.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guildId },
      { $inc: { energies: -economie.coutTicket, tickets: 1 } }
    );

    return interaction.editReply({ embeds: [embedGiveaway('Ticket Acheté !', `Tu as acheté **1 ticket** pour **${economie.coutTicket} EO**.\nTu peux maintenant participer à un giveaway actif !`)] });
  }

  // ─── GIVEAWAY : Participer ───
  if (id.startsWith('giveaway_participer_')) {
    await interaction.deferReply({ ephemeral: true });
    const giveawayId = id.replace('giveaway_participer_', '');

    const giveaway = await Giveaway.findById(giveawayId);
    if (!giveaway || giveaway.termine) {
      return interaction.editReply({ embeds: [embedError('Ce giveaway est terminé ou introuvable.')] });
    }

    if (giveaway.participants.includes(interaction.user.id)) {
      return interaction.editReply({ embeds: [embedError('Tu participes déjà à ce giveaway !')] });
    }

    if (giveaway.maxParticipants && giveaway.participants.length >= giveaway.maxParticipants) {
      return interaction.editReply({ embeds: [embedError('Le nombre maximum de participants est atteint.')] });
    }

    const userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guildId });
    if (!userData || userData.tickets < 1) {
      return interaction.editReply({ embeds: [embedError('Tu n\'as pas de ticket ! Achètes-en un dans le salon shop.')] });
    }

    // Consomme le ticket + ajoute participant
    await User.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guildId },
      { $inc: { tickets: -1 } }
    );
    giveaway.participants.push(interaction.user.id);
    await giveaway.save();

    // Met à jour le message du giveaway
    try {
      const salon = interaction.guild.channels.cache.get(giveaway.channelId);
      if (salon && giveaway.messageId) {
        const msg = await salon.messages.fetch(giveaway.messageId);
        const embed = msg.embeds[0];
        if (embed && msg.editable) {
          const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
          const newEmbed = EmbedBuilder.from(embed)
            .setDescription(`**🎁 Lot :** ${giveaway.lot}\n**⏱️ Fin :** <t:${Math.floor(giveaway.finAt.getTime() / 1000)}:R>\n**👥 Participants :** ${giveaway.participants.length}${giveaway.maxParticipants ? ` / ${giveaway.maxParticipants}` : ''}\n\n*Utilisez un ticket pour participer !*`);
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`giveaway_participer_${giveaway._id}`)
              .setLabel('🟢 Participer !')
              .setStyle(ButtonStyle.Success)
          );
          await msg.edit({ embeds: [newEmbed], components: [row] });
        }
      }
    } catch (_) {}

    return interaction.editReply({ embeds: [embedGiveaway('Participation Confirmée !', `Tu participes maintenant au giveaway **${giveaway.titre}** ! Bonne chance ! 🍀`)] });
  }

  // ─── QUÊTE : Lancer un fléau ───
  if (id.startsWith('quete_')) {
    await interaction.deferReply({ ephemeral: true });
    const nomFleauRaw = id.replace('quete_', '');
    const fleau = fleaux.find(f => f.nom === nomFleauRaw);
    if (!fleau) return interaction.editReply({ embeds: [embedError('Fléau introuvable.')] });

    // Simulation de combat (aléatoire 60% victoire)
    const victoire = Math.random() < 0.6;

    if (victoire) {
      await User.findOneAndUpdate(
        { userId: interaction.user.id, guildId: interaction.guildId },
        { $inc: { energies: fleau.recompense, xp: fleau.xp, fleauxVaincus: 1 } },
        { upsert: true }
      );
      return interaction.editReply({ embeds: [embedLevel(
        `⚔️ Victoire contre ${fleau.nom} !`,
        `Tu as vaincu le **${fleau.nom}** ${fleau.difficulte} !\n\n**Récompenses :**\n+\`${fleau.recompense} EO\`\n+\`${fleau.xp} XP\``
      )] });
    } else {
      return interaction.editReply({ embeds: [embedLevel(
        `💀 Défaite contre ${fleau.nom}`,
        `Le **${fleau.nom}** ${fleau.difficulte} était trop puissant cette fois...\n\n*Reviens plus fort !*`
      )] });
    }
  }
};
