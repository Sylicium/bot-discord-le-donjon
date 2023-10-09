const {
  ApplicationCommandType,
  EmbedBuilder
} = require('discord.js');
const emojiRegex = require('emoji-regex');
const regex = emojiRegex();

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't']

const options = [{
  name: 'question',
  description: 'Écris la question que tu souhaites poser',
  default_member_permissions: ['Administrator'],
  type: 3,
  required: true
}]

alphabet.map(x => {
  let option = {
    name: `choix_${x}`,
    description: `Écris le choix ${x}`,
    type: 3
  }
  options.push(option)
})

module.exports = {
  name: "poll",
  type: ApplicationCommandType.ChatInput,
  description: "créer un sondage",
  default_member_permissions: ['Administrator'],
  options: options,
  async run(client, interaction) {
    const question = interaction.options.getString('question');
    const arr = [];
    alphabet.map(x => {
      arr.push(interaction.options.getString(`choix_${x}`))
    })

    const options = arr.filter(function (el) {
      return el != null;
    });

    if (!options[0]) {
      const embed = new EmbedBuilder().setTitle('📊 ' + question);

      await interaction.reply({
        content: 'Votre poll a été envoyé.',
        ephemeral: true
      })
      await interaction.channel.send({
        embeds: [embed]
      }).then(msg => {
        msg.react('👍');
        msg.react('👎');
      });
    } else {

      const emojiAlphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

      const arr = [];
      options.map((x, index) => {
        for (const match of x.matchAll(regex)) {
          const emoji = match[0];
          emojiAlphabet[index] = emoji
        }
        arr.push(emojiAlphabet[index] + ' ' + x.replace(emojiAlphabet[index], ''));
      })

      const embed = new EmbedBuilder()
        .setTitle('📊 ' + question)
        .setDescription(arr.join('\n'))

      await interaction.reply({
        content: 'Votre poll a été envoyé.',
        ephemeral: true
      })
      await interaction.channel.send({
        embeds: [embed]
      }).then(msg => {
        for (let i = 0; i < options.length; i++) {
          msg.react(emojiAlphabet[i]);
        }
      });
    }
  }
}