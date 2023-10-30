const Discord = require('discord.js');
const { joinVoiceChannel } = require("@discordjs/voice");
const {
  ApplicationCommandType
} = Discord;
const canvasCmd = require('../../functions/canvasCmd');

module.exports = {
  name: "oldlevels",
  description: "Récupère le level de ActivityRank de tous les membres",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {

    let all_in_bdd = (await client.db._makeQuery(`SELECT user_id FROM users`)).map(x => x.user_id)

    let chan = client.channels.cache.get(client.config.static.channels.level_up)

    async function lots_of_messages_getter(channel, limit = 500) {
      const sum_messages = [];
      let last_id;
  
      while (true) {
          const options = { limit: 100 };
          if (last_id) {
              options.before = last_id;
          }
  
          const messages = await channel.messages.fetch(options);
          sum_messages.push(...messages.array());
          last_id = messages.last().id;
  
          if (messages.size != 100 || sum_messages >= limit) {
              break;
          }
      }
  
      return sum_messages;
  }

  let messages = lots_of_messages_getter(chan, 500)


  }
}