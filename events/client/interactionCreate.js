const Discord = require("discord.js");
const {
  InteractionType
} = Discord;

module.exports = async (client, interaction) => {


  if(client.config.developpement.restrictedMode) {
    if(!client.config.developpement.whitelistedUsers.includes(interaction.user.id)) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("FF0000")
            .setTitle(`Maintenance`)
            .setDescription(`Impossible d'interagir avec le bot pour le moment car il est en mode de restriction.\nVeuillez noter que les informations affichées telles que les niveaux, xp et autres peuvent être erronnées ou non à jour, ceci est tout à fait normal et reviendra comme avant après la maintenance.\nVeuillez réessayer ultérieurement.`)
        ],
        ephemeral: true,
      })
    } else {
      interaction.channel.send({
        content: `:warning: Le bot est en mode __maintenance restriction__.`
      }).then(m => { setTimeout(() => { m.delete() }, 3000 ) })
    }
  }
 


  if (interaction.type === 3 && interaction.customId === "relgement0") {
    validatedAt(client, interaction);
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return client.commands.delete(interaction.commandName);

    try {
      await command.run(client, interaction);
    } catch (error) {
      console.log(error);
    }
  }
}

async function validatedAt(client, interaction) {
  console.warn(`DISABLED CODE. interactionCreate.js:23`)
  return; // DISABLED CODE DUE TO USELESS DATABASE
  
  try {
    const user = await client.db.users.findOne({
      userID: interaction.user.id,
      guildID: interaction.guild.id
    });

    if (!user) return;

    user.join.validedAt = Date.now();

    user.save().catch(e => console.log(e));

  } catch (e) { }
}