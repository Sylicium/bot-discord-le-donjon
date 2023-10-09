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