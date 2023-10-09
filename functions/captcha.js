const { EmbedBuilder } = require('discord.js');

module.exports = {
  create: async function (client, member) {
    member?.roles?.add("1094318705883762721"); // Role pour l'accès au salon "Validation"

    const captchas = [{
      image: "bondage.png",
      result: "bondage"
    }, {
      image: "breath.png",
      result: "breath"
    }, {
      image: "edgeplay.png",
      result: "edgeplay"
    }];

    const channel = client.channels.cache.get('1094318707456618609'); //ID du channel "Validation"
    const random = Math.floor(Math.random() * captchas.length);
    const embed = new EmbedBuilder()
      .setImage(`attachment://${captchas[random].image}`)

    channel.send({ content: `Salut ${member}, tu as 3 minutes pour complèter ce captcha.`, embeds: [embed], files: [`./pictures/captchas/${captchas[random].image}`] }).then(msg => {
      const filter = m => m.content.toLowerCase().replace(/ /g, '') === captchas[random].result && m.author.id === member.id;
      const collector = msg.channel.createMessageCollector({ filter, time: 3 * 60 * 1000 });

      collector.on('collect', async m => {

        const user = await client.db.users.findOne({
          userID: member.id,
          guildID: member.guild.id
        }).catch(e => { });

        user.join.captchedAt = Date.now();
        await user.save().catch(e => { console.log(e) });
        msg.delete();
        channel.messages.fetch().then((messages) => {
          messages.map(mess => {
            if (mess.author.id === member.id)
              mess.delete();
          });
        });
        member.roles.remove("1094318705883762721"); // Role pour l'accès au salon "Validation"
        member.send({ content: "Bonjour " + "<@" + member.user.id + ">" + "\n 🙏 Pour demander à intégrer le Donjon, merci d'ouvrir un ticket, après avoir lu et accepté le <#1101963365657628722>\n ⚠️ Lisez attentivement le règlement avant de le valider : __il sera masqué lorsque vous aurez à répondre au court questionnaire__\n_\n_\n" }).catch(e => { });
      });

      collector.on('end', collected => {
        msg.delete().catch(e => { })
        channel.messages.fetch().then((messages) => {
          messages.map(mess => {
            if (mess.author.id === member.id)
              mess.delete();
          });
        });
        if (member._roles.includes('1094318705883762721')) // Role pour l'accès au salon "Validation"
          member.kick();
      });
    });
  }
};