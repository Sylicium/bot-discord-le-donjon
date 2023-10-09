const {
  ApplicationCommandType
} = require('discord.js');
const canvasCmd = require('../../functions/canvasCmd');

module.exports = {
  name: "editprofile",
  description: "Permet la personnalisation de votre profile.",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    canvasCmd.editProfile(client, interaction);
  }
}