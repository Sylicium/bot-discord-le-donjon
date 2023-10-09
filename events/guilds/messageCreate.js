const stats = require('../../functions/userStats');

module.exports = async (client, message) => {
  if (message.attachments.size > 0)
    stats.addImg(client, message);
  if (message.content)
    stats.addMess(client, message);
}