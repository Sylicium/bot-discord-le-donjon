const {
  ApplicationCommandType
} = require('discord.js');
const canvasCmd = require('../../functions/canvasCmd');

module.exports = {
  name: "top",
  description: "Affiche le classement des membres du serveur.",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    canvasCmd.sendLeaderBoard(client, interaction);
  }
}