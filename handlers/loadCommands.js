const fs = require('fs');

const {
	PermissionsBitField
} = require('discord.js');
const {
	Routes
} = require('discord-api-types/v10');
const {
	REST
} = require('@discordjs/rest')


const config = require('./../config');
const TOKEN = config.token;
const clientId =  config.clientId[config.startMode]
const guildId = config.guildId[config.startMode]

const rest = new REST({
	version: '10'
}).setToken(TOKEN);

module.exports = (client) => {

	const commands = [];

	fs.readdirSync('./commands/').forEach(async dir => {
		const files = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

		for (const file of files) {
			const command = require(`../commands/${dir}/${file}`);
			if (command.type) {
				if (command.name) {
					client.commands.set(command.name, command)
				}

				commands.push({
					name: command.name,
					type: command.type,
					description: command.type === 1 ? command.description : null,
					options: command.options ? command.options : null,
					default_permission: command.default_permission ? command.default_permission : null,
					default_member_permissions: command.default_member_permissions ? PermissionsBitField.resolve(command.default_member_permissions).toString() : null
				});
			}
		}
	});

	(async () => {
		try {
			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: commands
			});
			console.log('Applications • Registered');
		} catch (error) {
			console.log(error);
		}
	})();
};