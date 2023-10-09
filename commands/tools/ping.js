const {
	ApplicationCommandType
} = require('discord.js');

module.exports = {
	name: 'ping',
	type: ApplicationCommandType.ChatInput,
	description: "Voir le ping du bot",
	run: async (client, interaction) => {
		interaction.reply({
			content: `🏓 Pong! Latence: **${Math.round(client.ws.ping)} ms**`
		})
	}
};