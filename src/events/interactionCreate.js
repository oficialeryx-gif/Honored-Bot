const { embedError } = require('../utils/embeds');
const User = require('../database/User');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Commandes slash
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Vérif blacklist
      const userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guildId });
      if (userData?.blacklisted) {
        return interaction.reply({ embeds: [embedError('Tu es blacklisté et ne peux pas utiliser ce bot.')], ephemeral: true });
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`Erreur commande ${interaction.commandName} :`, error);
        const msg = { embeds: [embedError('Une erreur est survenue lors de l\'exécution de cette commande.')], ephemeral: true };
        if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
        else await interaction.reply(msg);
      }
    }

    // Boutons
    if (interaction.isButton()) {
      const handler = require('../handlers/buttons');
      await handler(interaction, client);
    }
  },
};
