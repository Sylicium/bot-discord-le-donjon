const stats = require('./userStats');

module.exports = {
  // create: async function (client, invite) {
  //   const newInvite = new client.db.invites({
  //     guildID: invite.guild.id,
  //     code: invite.code,
  //     inviter: invite.inviter.id
  //   });

  //   await newInvite.save().catch(e => { console.log(e) });
  // },
  // delete: async function (client, invite) {
  //   await client.db.invites.deleteOne({
  //     guildID: invite.guild.id,
  //     code: invite.code
  //   }).catch(e => { console.log(e) });
  // },
  // restart: async function (client) {
  //   for (const guild of client.guilds.cache) {
  //     const dbInvites = await client.db.invites.find({
  //       guildID: guild[1].id
  //     }).catch(e => { console.log(e) });

  //     const guildInvites = [];
  //     await guild[1].invites.fetch().then(invites => {
  //       for (const inv of invites) {
  //         guildInvites.push({
  //           code: inv[1].code,
  //           inviter: inv[1].inviterId,
  //           uses: inv[1].uses
  //         });
  //       }
  //     });

  //     // Supprime les invites en trop de la BDD
  //     await dbInvites.map(async x => {
  //       if (!guildInvites.some(y => x.code === y.code && x.uses === y.uses))
  //         await client.db.invites.deleteOne({
  //           guildID: guild[1].id,
  //           code: x.code
  //         }).catch(e => { console.log(e) });
  //     });

  //     // Ajoute les invites manquante à la BDD
  //     guildInvites.map(async x => {
  //       if (!dbInvites.some(y => x.code === y.code && x.uses === y.uses)) {
  //         const newInvite = new client.db.invites({
  //           guildID: guild[1].id,
  //           code: x.code,
  //           inviter: x.inviter,
  //           uses: x.uses
  //         });

  //         await newInvite.save().catch(e => { console.log(e) });
  //       }
  //     });
  //   }
  // },
  newUser: async function (client, member) {
    // const dbInvites = await client.db.invites.find({
    //   guildID: member.guild.id
    // }).catch(e => { console.log(e) });

    // const guildInvites = [];
    // await member.guild.invites.fetch().then(invites => {
    //   for (const inv of invites) {
    //     guildInvites.push({
    //       code: inv[1].code,
    //       inviter: inv[1].inviterId,
    //       uses: inv[1].uses
    //     });
    //   }
    // });

    // var inviter;
    // guildInvites.map(async x => {
    //   if (!dbInvites.some(y => x.code === y.code && x.uses === y.uses))
    //     inviter =  x.inviter;
    // });

    stats.createUser(client, member, null) //inviter
  }
};