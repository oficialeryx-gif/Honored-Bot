const { ajouterXP } = require('../utils/xp');
const User = require('../database/User');
const Guild = require('../database/Guild');

const cooldowns = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const config = require('../config/config');

    // Anti-spam XP cooldown
    const key = `${message.author.id}-${message.guild.id}`;
    const now = Date.now();
    if (cooldowns.has(key) && now - cooldowns.get(key) < config.xp.cooldown) return;
    cooldowns.set(key, now);

    // Auto-modération mots interdits
    const guildData = await Guild.findOne({ guildId: message.guild.id });
    if (guildData?.motsInterdits?.length) {
      const contenu = message.content.toLowerCase();
      const trouvé = guildData.motsInterdits.some(mot => contenu.includes(mot.toLowerCase()));
      if (trouvé) {
        await message.delete().catch(() => {});
        return message.channel.send({ content: `<@${message.author.id}> Ce message contient un mot interdit.` })
          .then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
      }
    }

    await ajouterXP(message.member, message.guild, client);
  },
};
