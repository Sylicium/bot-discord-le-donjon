const {
	ApplicationCommandType
} = require('discord.js');
const somef = require("../../someFunctions")

module.exports = {
	name: 'whoami',
	type: ApplicationCommandType.ChatInput,
	description: "Who am i ?",
	run: async (client, interaction) => {
		interaction.reply({
			content: [
				`USERPROFILE: \`${process.env.userprofile}\``,
				`USERDOMAIN: \`${process.env.userdomain}\``,
				`Uptime: \`${somef.formatTime(client.uptime, `YYYY années, MM mois, DD jours, hhhmmmsss`)}\``,
			].join("\n")
		})
	}
};