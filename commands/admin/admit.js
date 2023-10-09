const Discord = require('discord.js');
const {
  ApplicationCommandType,
  AttachmentBuilder
} = Discord
const Canvas = require('@napi-rs/canvas');
const {
  request
} = require('undici');
const moment = require("moment");

module.exports = {
  name: "admit",
  type: ApplicationCommandType.ChatInput,
  description: "Intégrer un membre ou l'admettre dans une chambre.",
  default_member_permissions: ['Administrator'],
  options: [{
    name: ' accès',
    description: 'choisir l\'accès à ajouter au membre.',
    type: 3,
    choices: [{
      name: "Tampon",
      value: "tampon"
    }, {
      name: "Chambre blanche",
      value: "blanche"
    }, {
      name: "Chambre noire",
      value: "noire"
    }, {
      name: "Chambre rouge",
      value: "rouge"
    },
      // {
      //   name: "Propagandistes",
      //   value: "propagandiste"
      // }, {
      //   name: "Partenaires particuliers",
      //   value: "partenaire"
      // }
    ],
    required: true
  }, {
    type: 6,
    name: 'membre',
    description: 'quel membre voulez vous faire passer de chambre?',
    required: true
  }],
  async run(client, interaction) {

    /****** DISABLED COMMAND ******/
    return client.disabledCommand(interaction)
    /****** DISABLED COMMAND ******/






    const access = interaction.options.getString('accès');
    const userId = interaction.options.getUser('membre').id;
    const guild = client.guilds.cache.get('1094318705883762719');
    const member = guild.members.cache.get(userId);

    if (access === "tampon") {
      member.roles.add('1094318706248646868');
      member.roles.remove('1094318706248646869');

      const channel = guild.channels.cache.get('1094318707116888093');

      const canvas = Canvas.createCanvas(1024, 500);
      const context = canvas.getContext('2d');

      const background = await Canvas.loadImage('./pictures/client_Entree_red.png');
      context.drawImage(background, 0, 0, 1024, 500);

      context.font = '42px sans-serif';
      context.fillStyle = '#ffffff';
      context.textAlign = "center";
      context.fillText(member.user.username, 512, 410);

      context.font = '20px sans-serif';
      context.fillStyle = '#ffffff';
      context.textAlign = "center";
      context.fillText('Compte créé le : ' + moment(member.user.createdAt).locale('fr').format("LL"), 512, 482);

      context.beginPath();
      context.arc(512, 166, 119, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      const {
        body
      } = await request(member.user.displayAvatarURL({
        extension: 'png'
      }));
      const avatar = await Canvas.loadImage(await body.arrayBuffer());

      context.drawImage(avatar, 393, 37, 238, 238);

      const attachment = new AttachmentBuilder(await canvas.encode('png'), {
        name: 'profile-image.png'
      });

      const user = (await client.db?.users?.findOne({
        userID: member.user.id,
        guildID: member.guild.id
      })) ?? false

      if (!user) return interaction.reply({ content: `Cette personne n'a pas de bdd`, ephemeral: true });

      user.isMember = true;

      await user.save().catch(e => console.log(e));

      channel.send({
        content: `${member}`,
        files: [attachment]
      });

      interaction.reply({
        content: `Félicitations ${member}, tu peux désormais choisir tes <#1110048370459947008>`,
        files: [`./pictures/tampon.png`]
      });
    } else {
      const table = {
        blanche: {
          chat: "1094318708425490503",
          global: ["1094318706378682382"],
        },
        noire: {
          chat: "1094318708865912894",
          clef: "1094318706378682384",
          global: ["1094318706403836057"],
        },
        rouge: {
          chat: "1094318708865912900",
          clef: "1094318706403836059",
          global: ["1094318706437410906", "1110661879224868944"],
        },
      }

      for (const role of table[access].global) {
        if (!member.roles.cache.has(role))
          member.roles.add(role);
      }
      if (table[access].clef)
        if (member.roles.cache.has(table[access].clef))
          member.roles.remove(table[access].clef);

      if (table[access].chat) {
        const channel = guild.channels.cache.get(table[access].chat);
        channel.send({ content: `**${member} vient tout juste de rejoindre la chambre ${access}.**`, files: [`./pictures/portes/${access}.png`] })

        interaction.reply({ content: `Ajoute de ${member} à la chambre ${access}.`, ephemeral: true });
      } else {
        interaction.reply({ content: `Ajout du rôle ${access} à ${member}.` })
      }

    }
  }
}