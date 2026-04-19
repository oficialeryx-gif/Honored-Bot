module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ ${client.user.tag} est en ligne !`);
    client.user.setActivity('le serveur Honored 👑', { type: 3 });
  },
};
