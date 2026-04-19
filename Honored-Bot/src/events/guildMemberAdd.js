const Guild = require('../database/Guild');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const config = await Guild.findOne({ guildId: member.guild.id });
    if (!config) return;

    // Autorole
    if (config.roles.autoRole) {
      const role = member.guild.roles.cache.get(config.roles.autoRole);
      if (role) await member.roles.add(role).catch(() => {});
    }

    // Message de bienvenue
    if (config.welcome.actif && config.salons.welcome) {
      const salon = member.guild.channels.cache.get(config.salons.welcome);
      if (!salon) return;
      const msg = config.welcome.message.replace('{user}', `<@${member.id}>`);
      const embed = new EmbedBuilder()
        .setColor(0xFF00FF)
        .setTitle('👑 Bienvenue sur Honored !')
        .setDescription(msg)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();
      await salon.send({ embeds: [embed] });
    }
  },
};
