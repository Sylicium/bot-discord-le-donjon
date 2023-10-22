const Discord = require('discord.js');
const { joinVoiceChannel } = require("@discordjs/voice");
const {
  ApplicationCommandType
} = Discord;
const canvasCmd = require('../../functions/canvasCmd');

module.exports = {
  name: "seikam",
  description: "REVEILLE TOI SEIKAM",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    interaction.reply({
      content: "Je ramène seikam en envoyant 1 ping tous les 2 secondes pendant 1min, soit 30 ping total."
    })

    for(let i=0;i<30;i++) {
      await interaction.channel.send({
        content: `<@467333274314997760> Reveille toi !`
      })
      await sleep(2000)
    }
    
  }
}