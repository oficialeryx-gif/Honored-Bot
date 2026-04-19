# 👑 Honored Bot — Guide de Déploiement

## 1. Prérequis
- Node.js v18+
- Un compte MongoDB Atlas (gratuit)
- Un bot Discord (portal.discord.com)

## 2. Configuration Railway

1. Push ce repo sur GitHub
2. Va sur [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Ajoute les variables d'environnement suivantes dans Railway :

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Token de ton bot Discord |
| `CLIENT_ID` | ID de ton application Discord |
| `GUILD_ID` | ID de ton serveur (pour deployer les commandes) |
| `MONGODB_URI` | URI de connexion MongoDB Atlas |

## 3. Déployer les commandes slash

Lance une fois depuis ton terminal ou dans le start command Railway :
```
node src/deploy-commands.js
```

## 4. Commandes disponibles

### 🔵 Modération
| Commande | Description |
|---|---|
| `/ban` | Bannir un membre |
| `/kick` | Expulser un membre |
| `/mute` | Rendre silencieux (durée) |
| `/unmute` | Lever le silence |
| `/warn` | Avertir (système progressif auto) |
| `/unwarn` | Retirer le dernier warn |
| `/clear` | Supprimer des messages |
| `/slowmode` | Mode lent du salon |
| `/modlogs` | Historique de modération |
| `/blacklist` | Blacklister du bot |

### 🔴 Niveaux & Économie
| Commande | Description |
|---|---|
| `/profil` | Voir son profil |
| `/leaderboard` | Classement niveaux / EO |
| `/energie` | Voir son solde EO |
| `/quete` | Lancer une quête contre un Fléau |

### 🟣 Giveaways
| Commande | Description |
|---|---|
| `/giveaway create` | Créer un giveaway |
| `/giveaway end` | Terminer un giveaway |
| `/giveaway reroll` | Reroll le gagnant |
| `/giveaway list` | Lister les giveaways actifs |
| `/shoptickets` | Envoyer le message du shop |

### ⚙️ Serveur
| Commande | Description |
|---|---|
| `/setup` | Configurer les salons |
| `/welcome` | Message de bienvenue |
| `/autorole` | Rôle automatique |
| `/serverinfo` | Infos du serveur |

## 5. Système de warns automatique
- **1 warn** → Mute 30 minutes
- **2 warns** → Mute 2 heures
- **3 warns** → Ban 7 jours

## 6. Couleurs des embeds
- 🔵 Modération : `#0000FF`
- 🟣 Giveaways : `#FF00FF`
- 🔴 Niveaux/Économie : `#FF0000`
