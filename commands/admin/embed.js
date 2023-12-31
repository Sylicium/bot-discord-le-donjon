const {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle
} = require("discord.js")

const {
  roles
} = require('../../config');

module.exports = {
  name: "embed",
  type: ApplicationCommandType.ChatInput,
  description: "votre genre",
  default_member_permissions: ['Administrator'],
  options: [{
    name: "type",
    description: "Choisis l'embed à envoyer",
    type: 3,
    choices: roles.map(x => {
      let choix = {
        name: x.name,
        value: x.name.toLowerCase()
      }
      return choix;
    }),
    required: true
  }],
  async run(client, interaction) {

    const subCommand_value = interaction.options.getString('type');

    function send_embedAndRoleSelect(config__role_and_embed) {
      const embeds = [];
      config__role_and_embed.embed.map(em => {
        let embed = new EmbedBuilder()
          .setColor(0x020000) // .setColor(em.color ? `0x${em.color}` : 0x020000)
          .setDescription(`${em.roles.map(dsc => {
            return `${dsc.emoji} [ ${dsc.desc} ]\n\n`;
          }).join('')}`);
        embeds.push(embed);
      });

      const rows = [];
      config__role_and_embed.embed.map(ro => {
        let row = new ActionRowBuilder()
          .addComponents(
            ro.roles.map(r => {
              return new ButtonBuilder()
                .setCustomId(r.buttonCustomId)
                .setEmoji(r.emoji)
                .setStyle(ButtonStyle.Secondary);
            })
          );
        rows.push(row);
      });

      const picture = config__role_and_embed.picture ? `./pictures/roles/${config__role_and_embed.picture}` : false
      sendEmbed(picture, embeds, rows);
    }


    let config__role_and_embed_list = client.config.roles.filter(x => {
      return x.name == subCommand_value
    })

    if(config__role_and_embed_list.length == 0) {
      return interaction.reply({
        content: `Erreur, paramètre invalide/valeur introuvable dans la config: ${subCommand_value}`
      })
    }

    let config__role_and_embed = config__role_and_embed_list[0]
   

    async function sendEmbed(picture, embeds, rows) {
      await interaction.reply({
        content: 'Embed envoyé!',
        ephemeral: true
      });


      if (!picture) {
        for (let i = 0; i < embeds.length; i++) {
          interaction.channel.send({
            embeds: [embeds[i]],
            components: [rows[i]]
          });
        };
      } else {
        interaction.channel.send({
          files: [picture]
        }).then(msg => {
          for (let i = 0; i < embeds.length; i++) {
            interaction.channel.send({
              embeds: [embeds[i]],
              components: [rows[i]]
            });
          };
        }).catch(e => {
          console.log(e)
        })
      }
    }
    
    send_embedAndRoleSelect(config__role_and_embed)
    
    return;


    var n = -1
    

    /*roles.find(x => {
      return x.name == subCommand
    })
    */



    roles.map(x => {
      if (x.name === subCommand) {
        const embeds = [];
        x.embed.map(em => {
          let embed = new EmbedBuilder()
            .setColor(0x020000) // .setColor(em.color ? `0x${em.color}` : 0x020000)
            .setDescription(`${em.roles.map(dsc => {
              return `${dsc.emoji} [ ${dsc.desc} ]\n\n`;
            }).join('')}`);
          embeds.push(embed);
        });

        const rows = [];
        x.embed.map(ro => {
          let row = new ActionRowBuilder()
            .addComponents(
              ro.roles.map(r => {
                n++;
                return new ButtonBuilder()
                  .setCustomId(x.name + n)
                  .setEmoji(r.emoji)
                  .setStyle(ButtonStyle.Secondary);
              })
            );
          rows.push(row);
        });

        const picture = x.picture ? `./pictures/roles/${x.picture}` : false
        sendEmbed(picture, embeds, rows);
      };
    });
  }
}