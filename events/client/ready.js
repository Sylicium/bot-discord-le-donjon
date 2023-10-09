
const db = require("../../mongoDB");

module.exports = async (client) => {
  if (client.config.mongodbURL) {
    const mongoose = require("mongoose")
    mongoose.connect(client.config.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(async () => {
      client.db = db
      console.log(`Connecté à MongoDB`);
      console.log(`${client.user.tag} est prêt ✔`);
    }).catch((err) => {
      console.log("Une erreur est survenue lors de la conenction à la BDD!",err);
      console.log(`${client.user.tag} est prêt sans BDD ✔`);
    });
  } else {
    console.log("Aucun lien vers la base de donnée est inscris dans la config!");
    console.log(`${client.user.tag} est prêt sans BDD ✔`);
  }
}