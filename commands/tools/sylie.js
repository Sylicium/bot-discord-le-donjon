const Discord = require('discord.js');
const { EmbedBuilder, DiscordAPIError, ApplicationCommandType} = Discord
const moment = require("moment");

module.exports = {
  name: "sylie",
  description: "Commandes de débug du bot pour Sylie~",
  type: ApplicationCommandType.ChatInput,
  options: [{
    name: 'sqlreq',
    description: 'Afficher le resultat de certaines requetes SQL.',
    type: Discord.ApplicationCommandOptionType.Subcommand
  }],
  run: async (client, interaction) => {

    if(interaction.user.id != client.config.static.users.sylicium) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("FF0000")
            .setDescription([
              `Vous n'avez pas le droit d'utiliser cette commande.`
            ].join("\n"))
        ]
      })
    }

    const Subcommand = interaction.options.getSubcommand() || null;

    if(Subcommand == "sqlreq") {

      let SQL_commands = [
        [`SELECT COUNT(*) FROM users;`, []],
        [`SELECT COUNT(*) FROM user_stats;`, []],
        [`SELECT COUNT(*) FROM users;`, []],
        [`SELECT COUNT(*) FROM user_stats;`, []],
      ]
      let SQL_results = [];
      for(let i in SQL_commands) {
        let result 
        try {
          result = await client.db._makeQuery(SQL_commands[i][0], SQL_commands[i][1])
        } catch(e) {
          let prefix = `{ERROR#${Date.now()}}`
          console.log(prefix,e)
          result = `${prefix} ${e}`
        }
        console.log("SQL_commands:",SQL_commands)
        SQL_results.push({
          cmd: SQL_commands[i],
          result: result
        })
      }

      BigInt.prototype["toJSON"] = function () {
        return this.toString();
      };

      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("00FF00")
            .setDescription([
              `Requetes SQL:`,
              `${SQL_results.map(x => {
                return `\`\`\`${x.cmd[0]}\n${JSON.stringify(x.result, null, 4)}\`\`\` `
              }).join("")}`,
            ].join("\n"))
        ]
      })
    }

  }
}