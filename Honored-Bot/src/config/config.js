module.exports = {
  colors: {
    moderation: 0x0000FF,
    giveaway: 0xFF00FF,
    levels: 0xFF0000,
    success: 0x57F287,
    error: 0xFF0000,
  },
  xp: {
    parMessage: 15,
    cooldown: 60000,
    xpParNiveau: (niveau) => niveau * 100 + 100,
  },
  economie: {
    nomMonnaie: 'Énergies Occultes',
    abreviation: 'EO',
    coutTicket: 500,
  },
  warns: {
    mute1: { seuil: 1, duree: 30 * 60 * 1000, label: '30 minutes' },
    mute2: { seuil: 2, duree: 2 * 60 * 60 * 1000, label: '2 heures' },
    ban:   { seuil: 3, duree: 7 * 24 * 60 * 60 * 1000, label: '7 jours' },
  },
  fleaux: [
    { nom: 'Ombre Errante',     difficulte: '⭐',       recompense: 100,  xp: 50   },
    { nom: 'Spectre Maudit',    difficulte: '⭐⭐',     recompense: 250,  xp: 120  },
    { nom: 'Démon des Abysses', difficulte: '⭐⭐⭐',   recompense: 500,  xp: 250  },
    { nom: 'Archonte Corrompu', difficulte: '⭐⭐⭐⭐',  recompense: 1000, xp: 500  },
    { nom: 'Seigneur du Néant', difficulte: '💀',       recompense: 2500, xp: 1000 },
  ],
};
