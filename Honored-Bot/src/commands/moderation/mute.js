const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedMod, embedError } = require('../../utils/embeds');
const { envoyerLog } = require('../../utils/logs');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Rendre silencieux un membre')
    .addUserOption(o => o.setName('membre').setDescription('Le membre à mute').setRequired(true))
    .addStringOption(o => o.setName('duree').setDescription('Durée (ex: 10m, 1h, 1d)').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison du mute'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const membre = interaction.options.getMember('membre');
    const dureeStr = interaction.options.getString('duree');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    const dureeMs = ms(dureeStr);

    if (!membre) return interaction.reply({ embeds: [embedError('Membre introuvable.')], ephemeral: true });
    if (!dureeMs) return interaction.reply({ embeds: [embedError('Durée invalide. Exemple : `10m`, `1h`, `1d`')], ephemeral: true });
    if (dureeMs > 28 * 24 * 60 * 60 * 1000) return interaction.reply({ embeds: [embedError('La durée maximale est de 28 jours.')], ephemeral: true });

    await membre.timeout(dureeMs, raison);

    const embed = embedMod('Membre Mis en Sourdine', `**${membre.user.tag}** a été réduit au silence.`, [
      { name: '👤 Membre', value: `<@${membre.id}>`, inline: true },
      { name: '⏱️ Durée', value: dureeStr, inline: true },
      { name: '🛡️ Modérateur', value: `<@${interaction.user.id}>`, inline: true },
      { name: '📝 Raison', value: raison, inline: false },
    ]);

    await interaction.reply({ embeds: [embed] });
    await envoyerLog(interaction.guild, 'moderation', embed);
  },
};
