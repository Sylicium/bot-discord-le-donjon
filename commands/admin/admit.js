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


    const access = interaction.options.getString('accès');
    const userId = interaction.options.getUser('membre').id;
    const guild = client.guilds.cache.get(interaction.guild.id);
    const member = guild.members.cache.get(userId);

    if (access === "tampon") {
      await member.roles.add(client.config.static.roles.tampon); // Tampon
      await member.roles.remove(client.config.static.roles.captcha); // Captcha
      await member.roles.remove(client.config.static.roles.luEtApprouve); // Lu et Approuvé
 
      const welcomeChannel = guild.channels.cache.get(client.config.static.channels.arrivee); // welcome channel

      const canvas = Canvas.createCanvas(1024, 500);
      const context = canvas.getContext('2d');

      const background = await Canvas.loadImage('./pictures/client_Entree_red.png');
      context.drawImage(background, 0, 0, 1024, 500);

      context.font = '42px Arial';
      context.fillStyle = '#ffffff';
      context.textAlign = "center";
      context.fillText(member.user.username, 512, 410);

      // context.font = '20px Comic Sans MS'; // not supported, replace with 'Arial' (caps count !)
      // context.fillStyle = '#ffffff';
      // context.textAlign = "center";
      // context.fillText('Compte créé le : ' + moment(member.user.createdAt).locale('fr').format("LL"), 512, 482);

      context.beginPath();
      context.arc(512, 166, 119, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      const {
        body
      } = await request(member.user.displayAvatarURL({
        extension: 'png'
      }));
      console.log("avatarurl:",member.user.displayAvatarURL({
        extension: 'png'
      }))
      const avatar = await Canvas.loadImage(await body.arrayBuffer());

      context.drawImage(avatar, 393, 37, 238, 238);

      const attachment = new AttachmentBuilder(await canvas.encode('png'), {
        name: 'profile-image.png'
      });

      /*
      const user = (await client.db?.users?.findOne({
        userID: member.user.id,
        guildID: member.guild.id
      })) ?? false

      if (!user) return interaction.reply({ content: `Cette personne n'a pas de bdd`, ephemeral: true });

      user.isMember = true;

      await user.save().catch(e => console.log(e));
      */

      welcomeChannel.send({
        content: `${member}`,
        files: [attachment]
      });

      interaction.reply({
        content: `Félicitations ${member}, tu peux désormais choisir tes <#${client.config.static.channels.selectRoles}>`,
        files: [`./pictures/tampon.png`]
      });
    } else {
      const table = {
        blanche: {
          chat: client.config.static.channels.chambre_blanche, // #⚪╏grande-salle
          global: [client.config.static.roles.porte_blanche],
        },
        noire: {
          chat: client.config.static.channels.chambre_noire, // #⚫╏salle-des-trophées
          clef: "",
          global: [client.config.static.roles.porte_noire],
        },
        rouge: {
          chat: client.config.static.channels.chambre_rouge, // #chambre-rouge
          clef: "",
          global: [client.config.static.roles.porte_rouge],
        },
      }

      for (const role of table[access].global) {
        if (!member.roles.cache.has(role)) member.roles.add(role);
      }
      /*
      if (table[access].clef)
        if (member.roles.cache.has(table[access].clef))
          member.roles.remove(table[access].clef);
        */

      if (table[access].chat) {
        const chan = guild.channels.cache.get(table[access].chat);
        chan.send({ content: `**${member} vient tout juste de rejoindre la chambre ${access}.**`, files: [`./pictures/portes/${access}.png`] })

        interaction.reply({ content: `Ajoute de ${member} à la chambre ${access}.`, ephemeral: true });
      } else {
        interaction.reply({ content: `Ajout du rôle ${access} à ${member}.` })
      }

    }
  }
}