const Discord = require('discord.js');
const {
  ApplicationCommandType,
  EmbedBuilder
} = Discord;

module.exports = {
  name: "maketicket",
  type: ApplicationCommandType.ChatInput,
  description: "Envoyer l'embed de création de ticket",
  default_member_permissions: ['Administrator'],
  async run(client, interaction) {


    // in dev


  }
}
