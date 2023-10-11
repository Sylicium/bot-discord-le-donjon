const { Client, IntentsBitField, Partials, Collection } = require('discord.js');
const intents = new IntentsBitField(3276799)
const client = new Client({intents, partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]});
const config = require("./config");
const desc = require("./desc.js");

client.config = config;
client.desc = desc;
client.newUsersCD = new Set();
client.commands = new Collection();
client.newUsersCD = new Set();

['loadCommands', 'loadEvents'].forEach((handler) => {
  require(`./handlers/${handler}`)(client)
});

client.login(client.config.token)




function writeUncaughException(e, title) {
  console.error("[BOT] Uncaught Exception or Rejection", e.stack)
  console.error(e.stack.split("\n"))
  const fs = require('fs')

  let date = (new Date).toLocaleString("fr-FR")

  if (!title) title = "/!\\ UNCAUGH ERROR /!\\"

  let log_text = `${title} ${e.stack.split("\n").join("\n")}\n`

  //console.log(`[${date} ERROR] (unknown): /!\\ UNCAUGH ERROR /!\\ ${e.stack}`)
  if (!fs.existsSync("./logs/mainUncaugh.log")) {
      fs.writeFileSync("./logs/mainUncaugh.log", `File created on ${date}\n\n`)
  }
  let log_text_split = log_text.split("\n")
  for (let i in log_text_split) {
      fs.appendFileSync("./logs/mainUncaugh.log", `[${date} ERROR] (unknown): ${log_text_split[i]}\n`, 'utf8');
  }

  try {
      let bot = new Discord.Client()

      bot.on("ready", ready => {
          bot.channels.cache.get("1008343948093313076").send(`@everyone **${e}** \`\`\`js\n${e.stack}\`\`\` `)
      })
  } catch (err) {
      //console.log(err)
  }
  
}


process
  .on('unhandledRejection', (reason, p) => {
      console.log(reason, '[BOT] Unhandled Rejection at Promise', p);
      writeUncaughException(reason, "Unhandled Rejection (process.on handle)")
  })
  .on('uncaughtException', err => {
      console.log(err, '[BOT] Uncaught Exception thrown BBBBBBBBBB');
      writeUncaughException(err, "Uncaught Exception (process.on handle)")
  });