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
				`HOME: \`${process.env.home || process.env.HOME}\``,
				`HOSTNAME: \`${process.env.hostname || process.env.HOSTNAME}\``, 
				`NODE_ENV: \`${process.env.node_env || process.env.NODE_ENV}\``,
				`Uptime: \`${somef.formatTime(client.uptime, `YYYY années, MM mois, DD jours, hhhmmmsss`)}\``,
			].join("\n")
		})
	}
};