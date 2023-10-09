const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ChannelType,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const moment = require("moment");

module.exports.updateTickets = async (client, interaction, type) => {
  if (interaction?.type == 2) {
    if (type === "button") {
      const embed = new EmbedBuilder()
        .setTitle("Ouvrir un ticket")
        .setDescription(`Ouvrez un ticket pour accéder au questionnaire d'entrée.`)
        .setImage('attachment://ticket.png');

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('ticket_create_new')
            .setLabel('Ouvrir un ticket')
            .setStyle(ButtonStyle?.Primary)
        );

      interaction?.reply({
        content: 'fait',
        ephemeral: true
      })
      interaction?.channel?.send({
        files: ["./pictures/ticket.png"],
        components: [row],
        embeds: [embed]
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Ouvrir un ticket")
        .setDescription(`Veuilliez sélectionner la raison de votre ticket.`)
        .setImage('attachment://ticket.png');

      const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('ticket_create_new')
            .setPlaceholder('Sélectionner le ticket')
            .addOptions(
              {
                label: 'Passage chambre blanche',
                emoji: "⚪",
                value: 'white',
              },
              {
                label: 'Passage chambre noire',
                emoji: "⚫",
                value: 'black',
              },
              {
                label: 'Passage chambre rouge',
                emoji: "🔴",
                value: 'red',
              },
              {
                label: 'Partenariat',
                emoji: '🤝',
                value: 'part'
              },
              {
                label: 'Problème(s)',
                emoji: '❓',
                value: 'prob',
              },
            ),
        );

      interaction?.reply({
        content: 'fait',
        ephemeral: true
      })
      interaction?.channel?.send({
        files: ["./pictures/ticket.png"],
        components: [row],
        embeds: [embed]
      });
    }
  } else {
    switch (interaction?.customId?.slice(interaction?.customId?.indexOf('_') + 1, interaction?.customId?.lastIndexOf('_'))) {
      case 'create': {
        const selected = interaction?.values ? interaction?.values[0] : "form";
        let data = {
          form: {
            chanName: "🔷╏pseudo",
            embedTitle: null,
            embedDesc: `Tu souhaites intégrer le Donjon ?
            Parfait !
            Pour cela, merci de commencer par remplir ce formulaire :
            
            ╔═══════════════╗
               • Pseudo :
               • Âge :
               • Sexe/Genre :
            ╚═══════════════╝
            
            • **Comment avez-vous connu le Donjon ?**
            (Un membre ? précisez de qui il s'agit)
            (Un serveur partenaire, lequel est-ce ?)
            →
            • **Pourquoi nous rejoindre ?**
            →
            • **Comment pouvez vous accéder au trombinoscope ?**
            →
            • **Sous quelles conditions pouvez-vous envoyer et recevoir des MP ?**
            →
            • **Comment pouvez-vous accéder à la chambre rouge ?**
            →`
          },
          white: {
            chanName: "⚪╏pseudo",
            embedTitle: "Passage chambre blanche",
            embedDesc: "Tu souhaites passer la porte de la chambre **blanche** ? Pas de soucis !\nUn membre du staff va s'occuper de ton cas. \n\nMerci pour ton attente."
          },
          black: {
            chanName: "⚫╏pseudo",
            embedTitle: "Passage chambre noire",
            embedDesc: "Tu souhaites passer la porte de la chambre **noire** ? Pas de soucis !\nUn membre du staff va s'occuper de ton cas. \n\nMerci pour ton attente."
          },
          red: {
            chanName: "🔴╏pseudo",
            embedTitle: "Passage chambre rouge",
            embedDesc: "Tu souhaites passer la porte de la chambre **rouge** ? Pas de soucis !\nUn membre du staff va s'occuper de ton cas. \n\nMerci pour ton attente."
          },
          part: {
            chanName: "🤝╏pseudo",
            embedTitle: "Conclure un partenariat",
            embedDesc: "Si tu souhaites conclure un partenariat avec le donjon, c'est ici !\nMerci d'envoyer un message contenant la mention de <@959198467224387584> et les éléments suivants:\n- Nom du serveur\n- Nombre de membre\n- Thème du serveur\n- Lien d'invitation (Illimité)"
          },
          prob: {
            chanName: "⚠️╏pseudo",
            embedTitle: "Ticket",
            embedDesc: "Merci pour l'ouverture du ticket, je t'invite à écrire en détail la raison de l'ouverture pour qu'un membre du staff puisse s'occuper de toi le plus aisément possible.\n\nMerci pour ton attente.  "
          }
        }

        interaction?.guild?.channels?.create({
          name: data[selected]?.chanName?.replace('pseudo', interaction?.user?.username),
          parent: "1102170972884303964",
          type: ChannelType.GuildText,
          permissionOverwrites: selected === "form" ? [{
            id: interaction?.user?.id,
            allow: ["ViewChannel", "SendMessages", "AttachFiles", "ReadMessageHistory"]
          }, {
            id: "1132987058537902120",
            allow: ["ViewChannel", "SendMessages", "AttachFiles", "ReadMessageHistory"]
          }, {
            id: interaction?.guild?.id,
            deny: ["ViewChannel"]
          }] : [{
            id: interaction?.user?.id,
            allow: ["ViewChannel", "SendMessages", "AttachFiles", "ReadMessageHistory"]
          }, {
            id: "1132987058537902120",
            allow: ["ViewChannel", "ReadMessageHistory"],
            deny: ["SendMessages", "AttachFiles"]
          }, {
            id: interaction?.guild?.id,
            deny: ["ViewChannel"]
          }]
        }).then(async chan => {

          const embed = new EmbedBuilder()
            .setDescription(data[selected]?.embedDesc)
          if (data[selected]?.embedTitle) {
            embed.setTitle(data[selected]?.embedTitle)
          }

          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`ticket_close_${interaction?.user?.id}`)
                .setLabel('Fermer le ticket')
                .setStyle(ButtonStyle.Danger)
            )

          const user = await client?.db?.users?.findOne({
            userID: interaction?.user?.id,
            guildID: interaction.guild.id
          });

          user.join.ticketID = chan.id;
          await user.save().catch(e => console.log(e));

          const embed2 = new EmbedBuilder()

          if (!user.isMember) {
            embed2.setDescription(`>>> Arrivé à **${moment(user?.join.joinedAt).locale('fr').format("LTS")}**\nCaptcha validé à **${moment(user?.join.captchedAt).locale('fr').format("LTS")}**\nRèglement validé à **${moment(user?.join.validedAt).locale('fr').format("LTS")}**`) //${user.invitedBy ? `\nInvité par <@${user.invitedBy}>` : ''}
          }

          chan?.send({ content: `Salut, <@${interaction?.user?.id}>`, embeds: !user.isMember ? [embed, embed2] : [embed], components: [row] })
          interaction?.reply({ content: `Vous venez d'ouvrir un ticket: ${chan}`, ephemeral: true })
        }).catch(err => { console.log(err) })

        break
      }
      case 'close': {
        const guild = client?.guilds?.cache?.get('1094318705883762719');
        const member = guild?.members?.cache?.get(interaction?.user?.id);


        if (member?._roles?.includes('1094318706525470908') || member?._roles?.includes('543844179118129163')) {
          const attachment = await discordTranscripts?.createTranscript(interaction?.channel);

          client?.channels?.cache?.get('1094318711202140250').send({
            files: [attachment]
          }).then(msg => {
            let urlToPaste = msg?.attachments?.map(x => x.url)

            const embed = new EmbedBuilder()
              .setAuthor({
                name: 'Logs Ticket'
              })
              .setDescription(`📰 Logs du ticket \`${interaction?.channel?.name}\` créé par <@${interaction?.customId?.replace('ticket_close_', '')}> et supprimé par <@${interaction.user.id}>\n\nLogs: [**Clique ici pour voir les logs**](${urlToPaste})`)
              .setTimestamp();

            const embed2 = new EmbedBuilder()
              .setAuthor({
                name: 'Logs Ticket'
              })
              .setDescription(`📰 Logs de votre ticket \`${interaction?.channel?.name}\`: [**Clique ici pour voir les logs**](${urlToPaste})`)
              .setTimestamp();

            client?.channels?.cache?.get('1094318710430380037').send({
              embeds: [embed]
            });


            client?.users?.cache?.get(interaction?.customId?.replace('ticket_close_', '')).send({
              embeds: [embed2]
            }).catch(e => { });

            interaction?.channel?.send({ content: 'En cours de fermeture...' });

            setTimeout(() => {
              interaction?.channel?.delete();
            }, 5000)
          });
        } else {
          interaction?.reply({ content: 'Vous ne pouvez pas fermer le ticket, seul un membre du staff le peut.', ephemeral: true })
        }
        break
      }
    }
  }
}