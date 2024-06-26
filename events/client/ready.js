
//const db = require("../../mongoDB");
const SQLDB = require("../../SQLDB");
const somef = require("../../someFunctions")
const Discord = require("discord.js")
const config = require("../../config")

module.exports = async (client) => {
  console.log(`[BOT] Bot démarré en tant que ${client.user.tag} (${client.user.id})`)

  client.somef = somef
  client.db = await SQLDB(config._SQLCredentials, true)

  client.disabledCommand = (interaction) => {
    return interaction.reply({
      content: "",
      embeds: [
        new Discord.EmbedBuilder()
          .setColor("FF0000")
          .setDescription(`Cette commande a été désactivée.`)
      ]
    })
  }

  /*
  if (client.config.mongodbURL) {
    const mongoose = require("mongoose")
    mongoose.connect(client.config.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(async () => {
      client.db = (...args) => {
        if(db) {
          return db(...args)
        } else {
          return {}
        }
      }
      console.log(`Connecté à MongoDB`);
      console.log(`${client.user.tag} est prêt ✔`);
    }).catch((err) => {
      console.log("Une erreur est survenue lors de la conenction à la BDD!",err);
      console.log(`${client.user.tag} est prêt sans BDD ✔`);
    });
  } else {
    console.log("Aucun lien vers la base de donnée est inscris dans la config!");
    console.log(`${client.user.tag} est prêt sans BDD ✔`);
  }*/
}
