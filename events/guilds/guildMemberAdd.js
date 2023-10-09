const invites = require('../../functions/invites');

module.exports = async (client, member) => {  
  if (member.id === "391922270303420417") return;
  if (Date.now() - member.user.createdAt < 1000 * 60 * 60 * 24 * 10) {
    await member.send({ content: `Tu as été kick du serveur pour raison de compte créée trop tôt.\nSi le sujet te tiens à coeur, rééssaye plus tard.` });
    return member.kick();
  }

  client.newUsersCD.add(member.id);
  setTimeout(() => {
    client.newUsersCD.delete(member.id);
  }, 2 * 60 * 1000);



  invites.newUser(client, member)
}