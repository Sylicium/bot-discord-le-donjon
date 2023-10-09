const stats = require('../../functions/userStats');

module.exports = async (client, reaction, user) => {
  stats.addReact(client, reaction, user);
}