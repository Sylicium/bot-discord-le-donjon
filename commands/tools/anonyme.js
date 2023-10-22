const Discord= require('discord.js');

module.exports = {
	name: 'anonyme',
	type: Discord.ApplicationCommandType.ChatInput,
	description: "Envoyer un message en anonyme",
	options: [{
	  name: 'message',
	  description: 'Votre message anonyme',
	  type: Discord.ApplicationCommandOptionType.String,
	  required: true
	}, {
		type: Discord.ApplicationCommandOptionType.Attachment,
		name: 'fichier1',
		description: "Votre image (attention à ne pas briser votre anonymat si on vous reconnait sur l'image!)",
	  },
	  {
		type: Discord.ApplicationCommandOptionType.Attachment,
		name: 'fichier2',
		description: "Fichier 2",
	  },
	  {
		type: Discord.ApplicationCommandOptionType.Attachment,
		name: 'fichier3',
		description: "Fichier 3",
	  },
	  {
		type: Discord.ApplicationCommandOptionType.Attachment,
		name: 'fichier4',
		description: "Fichier 4",
	  },
	  {
		type: Discord.ApplicationCommandOptionType.Attachment,
		name: 'fichier5',
		description: "Fichier 5",
	  },
	  {
		type: Discord.ApplicationCommandOptionType.Attachment,
		name: 'fichier6',
		description: "Fichier 6",
	  },
	  {
		type: Discord.ApplicationCommandOptionType.Attachment,
		name: 'fichier7',
		description: "Fichier 7",
	  }
	],
	run: async (client, interaction) => {


		

		if(interaction.channel.parent?.id != client.config.static.categories.animation
			&& interaction.channel.parent?.parent?.id != client.config.static.categories.animation
			&& interaction.channel.parent?.parent?.parent?.id != client.config.static.categories.animation
		) return interaction.reply({
			content: `Impossible d'utiliser la commande en dehors de la catégorie Animation !`,
			ephemeral: true
		})
		
		const message = interaction.options.getString('message');
		const fichiers = [
			interaction.options.getAttachment("fichier1"),
			interaction.options.getAttachment("fichier2"),
			interaction.options.getAttachment("fichier3"),
			interaction.options.getAttachment("fichier4"),
			interaction.options.getAttachment("fichier5"),
			interaction.options.getAttachment("fichier6"),
			interaction.options.getAttachment("fichier7")
		].filter(x => {
			return !!x
		})

		console.log("fichier:",fichiers)

		interaction.channel.send({
			content: `> **Message anonyme**\n\n${message}`,
			files: fichiers
		}).then(async (msg_anonyme) => {

			function genHex(length, capitalize=false) {
				let str = [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
				return (capitalize ? str.toUpperCase() : str.toLowerCase())
			}

			let buttonID_discard = `anonyme_discard_${genHex(32)}`
	
			let row = new Discord.ActionRowBuilder()
				.addComponents(
					new Discord.ButtonBuilder()
						.setCustomId(buttonID_discard)
						.setLabel("Annuler")
						.setStyle(Discord.ButtonStyle.Danger)
				);


			await interaction.reply({
				embeds: [
					new Discord.EmbedBuilder()
						.setColor("00FF00")
						.setDescription([
							`Message anonyme envoyé !\nSi vous souhaitez annuler et supprimer le message, cliquez sur le bouton ci-dessous.`
						].join("\n"))
				],
				components: [row],
				ephemeral: true
			})




			
			const filter = i => ( i.customId == buttonID_discard) && (i.isButton());
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5*60*1000 });
	
			collector.on("collect", async i => {
				if((i.message.createdTimestamp + 5*60*1000) < (Date.now())) return i.reply({
					content: "Cette interaction a expirée.",
					ephemeral: true
				})
				if( interaction.user.id != i.user.id ) return i.reply({
					content: "Cette interaction ne vous est pas destinée.",
					ephemeral: true
				})
				
	
				/******************/
					
				if(i.customId == buttonID_discard) {
					try {
						await msg_anonyme.delete()
						
						interaction.editReply({
							embeds: [
								new Discord.EmbedBuilder()
									.setColor("FFFFFD")
									.setDescription([
										`Message anonyme annulé.`
									].join("\n"))
							],
							components: [],
							ephemeral: true
						})
					} catch(e) {
						interaction.editReply({
							embeds: [
								new Discord.EmbedBuilder()
									.setColor("FF7F00")
									.setDescription([
										`Impossible d'annuler le message anonyme:`,
										`\`\`\`js\n${e.stack}\`\`\``
									].join("\n"))
							],
							components: [],
							ephemeral: true
						})
					}

					return;
				}

			})











		}).catch(e => {
			console.log(e)
			interaction.reply({
				embeds: [
					new Discord.EmbedBuilder()
						.setColor("FF0000")
						.setDescription([
							`Une erreur est survenue, impossible d'envoyer le message anonyme.`,
							`\`\`\`js\n${e.stack}\`\`\``
						].join("\n"))
				],
				ephemeral: true
			})
		})
	}
};