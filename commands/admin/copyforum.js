const Discord = require('discord.js');
const {
  ApplicationCommandType,
  AttachmentBuilder
} = Discord
const Canvas = require('@napi-rs/canvas');
const {
  request
} = require('undici');
const moment = require("moment");

module.exports = {
  name: "copyforum",
  type: ApplicationCommandType.ChatInput,
  description: "Dupliquer un forum et son contenu",
  default_member_permissions: ['Administrator'],
  options: [],
  async run(client, interaction) {

    console.log("channels:",interaction.guild.channels.cache.map(x => x))

  }
}