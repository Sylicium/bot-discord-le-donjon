const Discord = require("discord.js");
const {
  InteractionType,
  EmbedBuilder
} = Discord;
const { updateTickets } = require("../../functions/tickets");
const { editProfile, sendLeaderBoard } = require("../../functions/canvasCmd");

module.exports = async (client, interaction) => {
  if (interaction.type === InteractionType.MessageComponent) {
    if(!interaction) return;
    // if (interaction.customId === "relgement0" && client.newUsersCD.has(interaction.user.id)) return interaction.reply({ content: 'Vous devez attendre 2 minutes avant de pouvoir valider, profitez en pour lire le règlement.', ephemeral: true });
    if (interaction.customId.startsWith("ticket")) return updateTickets(client, interaction);
    if (interaction.customId.startsWith("editP")) return editProfile(client, interaction);
    if (interaction.customId.startsWith("top")) return sendLeaderBoard(client, interaction);

    if(interaction.customId == "btn_roleSelect_membre_membre") {
      interaction.member.roles.remove(client.config.static.roles.tampon)
      // pas de return car fin du code exécuté plus tard, notamment pour ajouter le role membre
    }

    console.log(`interaction customId (${interaction.customId}):`,interaction)

    /**
     * f() : Retourne true si au moins 1 élément se trouve dans les 2 listes
     * @param {Array} list - La 1ere liste
     * @param {Array} list_two - La 2ere liste
     * @param {Boolean} caseSensitive - Prendre en compte ou non la casse. Default: true
     */
    function SOMEF_any(list, list_two, caseSensitive=true) {
      if(!caseSensitive) {
          list = list.map(f=>{ return f.toLowerCase(); });
          list_two = list_two.map(f=>{ return f.toLowerCase(); });
      }
      for(let i in list) {
          if(list_two.indexOf(list[i]) != -1) return true
      }
      return false
    }

    let all_config_role_list = []

    for(let i in client.config.roles) {
      let temp0 = client.config.roles[i]
      let temp1 = temp0.embed
      let temp_roles = [];
      for(let the_embed_i in temp1) {
        let the_embed = temp1[the_embed_i]
        for(let role_i in the_embed.roles) {
          let role_data = the_embed.roles[role_i]
          temp_roles.push(role_data)
        }
      }
      all_config_role_list.push({
        name: temp0.name,
        type: temp0.type,
        picture: temp0.picture,
        roles: temp_roles
      })
    }

    function _getAllRolesOnly() {
      let list = [];
      for(let i in all_config_role_list) {
        for(let role_i in all_config_role_list[i].roles) {
          let role = all_config_role_list[i].roles[role_i]
          list.push(role)
        }
      }
      return list
    }

    let all_config_role_list_ONLY_ROLES = _getAllRolesOnly()

    //console.log("all_config_role_list",all_config_role_list)

    function getAllRolesFromType(type) {
      let temp1 = all_config_role_list.filter(x => x.type == type)
      let list = [];
      for(let i in temp1) {
        for(let role_i in temp1[i].roles) {
          let role = temp1[i].roles[role_i]
          list.push(role)
        }
      }
      return list
    }

    // console.log("getAllRolesFromType(1)", getAllRolesFromType(1))
    // console.log("getAllRolesFromType(2)", getAllRolesFromType(2))
    // console.log("getAllRolesFromType(3)", getAllRolesFromType(3))

    function getRoleSelectMenuContext_fromButtonCustomId(customId) {
      let ctx;
      for(let i in all_config_role_list) {
        let roleSelect_menu = all_config_role_list[i]
        if(roleSelect_menu.roles.map(x => x.buttonCustomId).includes(customId)) return roleSelect_menu
      }
      return null
    }

    function getRoleFromCustomId(customId) {
      let button_data = all_config_role_list_ONLY_ROLES.find(x => {
        return x.buttonCustomId == customId
      })

      if(!button_data) {
        interaction.reply({
          content: `Une erreur est survenue: **ERROR#02 ID d'interaction customId=${interaction.customId} introuvable dans la liste de role.**\nEssayez de contacter un administrateur.`
        })
        return { status: false, value: undefined }
      }

      let the_role = interaction.guild.roles.cache.get(button_data.role)
      
      if(!the_role) {
        interaction.reply({
          content: `Une erreur est survenue: **ERROR#03 Rôle à changer inexistant. ID=${button_data.role}.**\nEssayez de contacter un administrateur.`
        })
        return { status: false, value: undefined }
      }

      return { status: true, value: the_role }
    }

    if(interaction.customId == "btn_roleSelect_reglement_reglement") {
      async function validReglement() {
        try {
          await interaction.member.roles.add(client.config.static.roles.luEtApprouve)
          await interaction.member.roles.remove(client.config.static.roles.captcha)
          interaction.reply({
            embeds: [
              new Discord.EmbedBuilder()
                .setDescription(`Vous avez lu et accepté le règlement !`)
                .setColor("00FF00")
            ],
            ephemeral: true
          });
        } catch(e) {
          console.log(e)
          interaction.reply({
            embeds: [
              new Discord.EmbedBuilder()
                .setDescription(`Aïe.. une erreur est survenue à l'acceptation du règlement, essayez de contacter un administrateur. \`\`\`js\n${e}\`\`\``)
                .setColor("FF0000")
            ],
            ephemeral: true
          });
        }
      }
      validReglement()
      return;
    } else if(getAllRolesFromType(1).map(x => x.buttonCustomId).includes(interaction.customId)) {
      // TYPE 1 = on peut changer et avoir plusieurs roles

      console.log("USING role type 1")

      let back = getRoleFromCustomId(interaction.customId)
      if(!back.status) return;
      toggleRole(interaction, back.value)
      
    } else if(getAllRolesFromType(2).map(x => x.buttonCustomId).includes(interaction.customId)) {
      // TYPE 2 = on peut changer et max 1 seul role

      console.log("USING role type 2")
      let roleSelectMenu = getRoleSelectMenuContext_fromButtonCustomId(interaction.customId)

      let back = getRoleFromCustomId(interaction.customId)
      if(!back.status) return;
            
      let haveARole = SOMEF_any(interaction.member._roles, roleSelectMenu.roles.map(x => x.role))

      let haveARole_roleObject;
      for(let role_i in roleSelectMenu.roles) {
        let roleID = roleSelectMenu.roles[role_i].role
        if(interaction.member.roles.cache.has(roleID)) {
          haveARole_roleObject = interaction.guild.roles.cache.get(roleID)
          break;
        }
      }

      if(interaction.member.roles.cache.has(back.value.id)) {
        removeRole(interaction, back.value.id)
      } else {
        if(haveARole) {
          interaction.reply({
            content: `Vous ne pouvez avoir qu'un seul role dans ce menu !\nRetirez d'abord votre role <@&${haveARole_roleObject?.id ?? "<erreur>"}>`,
            ephemeral: true
          })
          return;
        }
        addRole(interaction, back.value.id)
      }

    } else if(getAllRolesFromType(3).map(x => x.buttonCustomId).includes(interaction.customId)) {
      // TYPE 3 = on peut PAS changer et max 1 seul role
      let roleSelectMenu = getRoleSelectMenuContext_fromButtonCustomId(interaction.customId)
      console.log("USING role type 3")

      if(SOMEF_any(interaction.member._roles, roleSelectMenu.roles.map(x => x.role))) {
        return cantRole(interaction)
      } else {
        let back = getRoleFromCustomId(interaction.customId)
        if(!back.status) return;
        addRole(interaction, back.value)
      }


    } else {
      /*interaction.reply({
        content: `Une erreur est survenue: **ERROR#01 ID d'interaction customId=${interaction.customId} introuvable.**\nEssayez de contacter un administrateur.`
      })*/
    }

    return;

    client.config.roles.map(async category => {
      if (category.name === interaction.customId.replace(/[0-9]/g, '')) {

        let allRole = []
        category.embed.map(em => {
          em.roles.map(ro => {
            allRole.push(ro.role);
          })
        })

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

function toggleRole(interaction, role) {
  try {
    if(interaction.member._roles.includes(role.id)) {
      removeRole(interaction, role)
    } else{
      addRole(interaction, role)
    }
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