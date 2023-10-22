const Discord = require("discord.js");
const { Client, IntentsBitField, Partials, Collection } = Discord;
const intents = new IntentsBitField(3276799)
const client = new Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildScheduledEvents,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.MessageContent
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.GuildScheduledEvent,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.ThreadMember,
        Discord.Partials.User
    ]
});
const config = require("./config");
const desc = require("./desc.js");


const { joinVoiceChannel } = require("@discordjs/voice");
const { addSpeechEvent, SpeechEvents } = require("discord-speech-recognition");

client.config = config;
client.desc = desc;
client.newUsersCD = new Set();
client.commands = new Collection();

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













const speechOptions = addSpeechEvent(client, { lang: "fr-FR" });

client.on("messageCreate", (msg) => {
    return;
    const voiceChannel = msg.member?.voice.channel;
    if (voiceChannel) {
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false,
      });
    }
  });


client.on(SpeechEvents.speech, (msg) => {

    //console.log("speech:", msg)

    if(!msg.guild) return;


    if(msg.duration < 1.5) return;

    if(msg.member.id != "300399893611151361") return;



    // console.log(`audioBuffer (${msg.duration}):`,Buffer.byteLength(msg.audioBuffer), "SOIT ", Buffer.byteLength(msg.audioBuffer)/msg.duration )


    let temp = [...msg.guild.channels.cache.map(x => x)]
    let le_no_micro_channel_list = temp.filter(x => {
        return (x.type == Discord.ChannelType.GuildText)
        && (
          (x.name == msg.channel.name)
          || (x.name == msg.channel.name.split(" ").join("-"))
          || (x.name == msg.channel.name.split(" ").join(""))
        )
    })

    if(le_no_micro_channel_list.length == 0) return;

    let chan = le_no_micro_channel_list[0] // Le bar

    if(!msg.content) {

        return;

        chan.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setAuthor({ name: (msg.member.nickname ?? msg.author.username), iconURL: msg.author.displayAvatarURL() })
                    .setColor("FF0000")
                    .setDescription(`Le québécois a dis quelque chose mais l'IA que je suis n'a rien compris ;-;`)
            ]
        }).then(() => {}).catch(e => {
            console.log(e)
        })
    } else {
        chan.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setAuthor({ name: (msg.member.nickname ?? msg.author.username), iconURL: msg.author.displayAvatarURL() })
                    .setColor("FDFFFF")
                    .setDescription(`${msg.content}`)
            ]
        }).then(() => {}).catch(e => {
            console.log(e)
        })
    }

  
    
});