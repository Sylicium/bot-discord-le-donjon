const {
  ApplicationCommandType
} = require('discord.js');
const canvasCmd = require('../../functions/canvasCmd');

module.exports = {
  name: "profile",
  description: "Affiche votre profile ou celui de la personne désigné.",
  type: ApplicationCommandType.ChatInput,
  options: [{
    name: 'utilisateur',
    description: 'Personne que tu souhaite voir le profile.',
    type: 6
  }],
  run: async (client, interaction) => {
    canvasCmd.sendProfile(client, interaction);
  }
}