const {
  InteractionType
} = require("discord.js");

module.exports = async (client, interaction) => {
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