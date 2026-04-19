const { SlashCommandBuilder } = require('discord.js');
const { embedLevel } = require('../../utils/embeds');
const User = require('../../database/User');
const { xp: xpConfig, economie } = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profil')
    .setDescription('Afficher ton profil Honored')
    .addUserOption(o => o.setName('membre').setDescription('Voir le profil d\'un autre membre')),

  async execute(interaction) {
    const cible = interaction.options.getMember('membre') || interaction.member;
    const userData = await User.findOne({ userId: cible.id, guildId: interaction.guildId });

    const niveau = userData?.niveau || 0;
    const xp = userData?.xp || 0;
    const energies = userData?.energies || 0;
    const fleaux = userData?.fleauxVaincus || 0;
    const xpNecessaire = xpConfig.xpParNiveau(niveau);
    const barreXP = Math.floor((xp / xpNecessaire) * 10);
    const barre = '█'.repeat(barreXP) + '░'.repeat(10 - barreXP);

    await interaction.reply({ embeds: [embedLevel(
      `Profil de ${cible.displayName}`,
      `> *Guerrier de l'obscurité, gardien des Énergies Occultes.*`,
      [
        { name: '⚡ Niveau', value: `\`${niveau}\``, inline: true },
        { name: `💎 ${economie.abreviation}`, value: `\`${energies.toLocaleString()}\``, inline: true },
        { name: '🎟️ Tickets', value: `\`${userData?.tickets || 0}\``, inline: true },
        { name: '💀 Fléaux Vaincus', value: `\`${fleaux}\``, inline: true },
        { name: `📊 XP [${barre}]`, value: `\`${xp} / ${xpNecessaire} XP\``, inline: false },
      ]
    )] });
  },
};
