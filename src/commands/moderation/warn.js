const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod, embedError } = require('../../utils/embeds');
const { envoyerLog } = require('../../utils/logs');
const User = require('../../database/User');
const { warns: warnsConfig } = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un membre')
    .addUserOption(o => o.setName('membre').setDescription('Le membre à avertir').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const membre = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison');
    if (!membre) return interaction.reply({ embeds: [embedError('Membre introuvable.')], ephemeral: true });

    const userData = await User.findOneAndUpdate(
      { userId: membre.id, guildId: interaction.guildId },
      { $push: { warns: { raison, modId: interaction.user.id, date: new Date() } } },
      { upsert: true, new: true }
    );

    const nbWarns = userData.warns.length;
    let action = '';

    if (nbWarns >= warnsConfig.ban.seuil) {
      await membre.ban({ reason: `${nbWarns} avertissements accumulés` }).catch(() => {});
      action = `\n🔨 **Action automatique :** Banni pour ${warnsConfig.ban.label}`;
    } else if (nbWarns >= warnsConfig.mute2.seuil) {
      await membre.timeout(warnsConfig.mute2.duree, 'Avertissements multiples').catch(() => {});
      action = `\n🔇 **Action automatique :** Mis en sourdine pour ${warnsConfig.mute2.label}`;
    } else if (nbWarns >= warnsConfig.mute1.seuil) {
      await membre.timeout(warnsConfig.mute1.duree, 'Premier avertissement').catch(() => {});
      action = `\n🔇 **Action automatique :** Mis en sourdine pour ${warnsConfig.mute1.label}`;
    }

    const embed = embedMod('Avertissement', `<@${membre.id}> a reçu un avertissement.${action}`, [
      { name: '⚠️ Avertissements', value: `${nbWarns}/3`, inline: true },
      { name: '🛡️ Modérateur', value: `<@${interaction.user.id}>`, inline: true },
      { name: '📝 Raison', value: raison, inline: false },
    ]);

    await interaction.reply({ embeds: [embed] });
    await envoyerLog(interaction.guild, 'moderation', embed);
  },
};
