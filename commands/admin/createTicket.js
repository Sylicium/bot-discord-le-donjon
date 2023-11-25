const {
  ApplicationCommandType,
} = require("discord.js")
const { updateTickets } = require("../../functions/tickets");

module.exports = {
  name: "createticket",
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: ['Administrator'],
  options: [{
    name: 'type',
    description: 'choisir l\'accès à ajouter au membre.',
    type: 3,
    choices: [{
      name: "button",
      value: "button"
    }, {
      name: "select",
      value: "select"
    }],
    required: true
  }],
  description: "Créé l'embed ticket.",
  async run(client, interaction) {
    const type = interaction.options.getString('type');
    updateTickets(client, interaction, type);
  }
}