const {
  InteractionType,
  EmbedBuilder
} = require("discord.js");
const { updateTickets } = require("../../functions/tickets");
const { editProfile, sendLeaderBoard } = require("../../functions/canvasCmd");

module.exports = async (client, interaction) => {
  if (interaction.type === InteractionType.MessageComponent) {
    if (interaction?.customId === "relgement0" && client.newUsersCD.has(interaction.user.id)) return interaction.reply({ content: 'Vous devez attendre 2 minutes avant de pouvoir valider, profitez en pour lire le règlement.', ephemeral: true });
    if (interaction?.customId.startsWith("ticket")) return updateTickets(client, interaction);
    if (interaction?.customId.startsWith("editP")) return editProfile(client, interaction);
    if (interaction?.customId.startsWith("top")) return sendLeaderBoard(client, interaction);

    client.config.roles.map(async category => {
      if (category.name === interaction.customId.replace(/[0-9]/g, '')) {

        let allRole = []
        category.embed.map(em => {
          em.roles.map(ro => {
            allRole.push(ro.role);
          });
        });

        let reactRole = ""
        allRole.map((x, index) => {
          if (index == interaction.customId.replace(/[^0-9\.]+/g, "")) {
            return reactRole = x
          }
        });

        if (category.type === 1) {
          if (interaction.member.roles.cache.has(reactRole)) {
            removeRole(interaction, reactRole);
          } else {
            addRole(interaction, reactRole);
          };
        };
        if (category.type === 2) {
          if (interaction.member.roles.cache.has(reactRole)) {
            removeRole(interaction, reactRole)
          } else if (allRole.some(role => interaction.member.roles.cache.has(role))) {
            allRole.map(role => {
              if (interaction.member.roles.cache.has(role)) {
                interaction.member.roles.remove(role);
              };
            });

            changeRole(interaction, reactRole);
          } else {
            addRole(interaction, reactRole);
          };
        };
        if (category.type === 3) {
          if (allRole.some(role => interaction.member.roles.cache.has(role))) {
            cantRole(interaction);
          } else {
            addRole(interaction, reactRole);
          };
        };
      };
    });
    // }
  }
}

function addRole(interaction, role) {
  try {
    interaction.member.roles.add(role).then(msg => {
      const embed = new EmbedBuilder()
        .setDescription("Votre rôle a été ajouté avec succès!")
        .setColor(0x008000)

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    });
  } catch (err) {
    error(interaction);
  }
}

function changeRole(interaction, role) {
  try {
    interaction.member.roles.add(role)

    const embed = new EmbedBuilder()
      .setDescription("Ton rôle a été changé avec succès!")
      .setColor(0x008000)

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  } catch (err) {
    error(interaction);
  }
}

function removeRole(interaction, role) {
  try {
    interaction.member.roles.remove(role).then(msg => {
      const embed = new EmbedBuilder()
        .setDescription("Votre rôle a été enlevé avec succès!")
        .setColor(0x008000)

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    });
  } catch (err) {
    error(interaction);
  }
}

function cantRole(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setDescription("Tu ne peux pas changer/enlever le rôle que tu possède dans cette catégorie!")
      .setColor(0xFF0000)

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  } catch (err) {
    error(interaction);
  }
}

function error(interaction) {
  const embed = new EmbedBuilder()
    .setDescription("Une erreur est survenue, si le problème persiste contactez un staff!")
    .setColor(0xFF0000)

  interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
}