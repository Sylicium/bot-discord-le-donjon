const {
	AttachmentBuilder,
	EmbedBuilder
} = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const {
	request
} = require('undici');
const moment = require("moment");

module.exports = async (client, member) => {

	let logChannel = client.channels.cache.get(client.config.static.logChannels.join_leave)
	  
	const guild = member.guild;
	const lchannel = guild.channels.cache.get(client.config.static.channels.depart);
	// const logChannel = guild.channels.cache.get('1102614305771364412')
	const bchannel = guild.channels.cache.get(client.config.static.channels.ban);
	const wchannel = guild.channels.cache.get(client.config.static.channels.arrivee);

	delWelcomeMessage(wchannel, member.user.id);

	/*
	const user = await client?.db?.users?.findOne({
		userID: member?.user?.id
	});

	if (user) {
		const ticket = guild?.channels?.cache?.get(user?.join?.ticketID);
		if (ticket)
			ticket?.send({ content: `${member} a quitté le serveur` });
	}
	*/


	

	if(member._roles.includes(client.config.static.roles.membre)) { //if (user && user?.isMember) {
		if (guild.bans.cache.get(member.user.id)) {
			const canvas = Canvas.createCanvas(1024, 500);
			const ctx = canvas.getContext('2d');

			const background = await Canvas.loadImage('./pictures/client_Ban.png');
			ctx.drawImage(background, 0, 0, 1024, 500);

			ctx.font = '42px arial';
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = "center";
			ctx.fillText(member.user.username + "#" + member.user.discriminator, 512, 410);

			ctx.font = '20px arial';
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = "center";
			ctx.fillText('Avait rejoint le : ' + moment(member.joinedAt).locale('fr').format("LL"), 512, 482);

			ctx.beginPath();
			ctx.arc(512, 166, 119, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();

			const {
				body
			} = await request(member.user.displayAvatarURL({
				extension: 'png'
			}));
			const avatar = await Canvas.loadImage(await body.arrayBuffer());

			ctx.drawImage(avatar, 393, 37, 238, 238);

			const attachment = new AttachmentBuilder(await canvas.encode('png'), {
				name: 'profile-image.png'
			});
			
			bchannel.send({
				content: `<@${member.user.id}> a été ban\n`,
				files: [attachment]
			});
		} else {
			const canvas = Canvas.createCanvas(1024, 500);
			const ctx = canvas.getContext('2d');

			const background = await Canvas.loadImage('./pictures/client_Sortie_red.png');
			ctx.drawImage(background, 0, 0, 1024, 500);

			ctx.font = '42px arial';
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = "center";
			ctx.fillText(member.user.username + "#" + member.user.discriminator, 512, 410);

			ctx.font = '20px arial';
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = "center";
			ctx.fillText('Avait rejoint le : ' + moment(member.joinedAt).locale('fr').format("LL"), 512, 482);

			ctx.beginPath();
			ctx.arc(512, 166, 119, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();

			const {
				body
			} = await request(member.user.displayAvatarURL({
				extension: 'png'
			}));
			const avatar = await Canvas.loadImage(await body.arrayBuffer());

			ctx.drawImage(avatar, 393, 37, 238, 238);

			const attachment = new AttachmentBuilder(await canvas.encode('png'), {
				name: 'profile-image.png'
			});
			lchannel.send({
				content: "<@" + member.user.id + ">" + " est parti 😥\n",
				files: [attachment]
			});
		}
	} else {
		console.log(`[/logs/guildMemberRemove.js] Un membre a quitté le discord mais il n'avais pas le role membre (${client.config.static.roles.membre})`)
	}

	if(logChannel) {
		logChannel.send({
			embeds: [
			  new EmbedBuilder()  
			  .setColor("00FF00")
			  .setAuthor({ name: member.nickname ?? member.user.username, iconURL: member.displayAvatarURL() })
			  .setDescription([
				`Aurevoir **${member.nickname ?? member.user.username}** ..`
			  ].join("\n"))
			  .setThumbnail(member.displayAvatarURL())
			  .setTimestamp()
			]
		})
	} else {
		return console.log(`[guildMemberRemove] logChannel undefined. No channel found with ID=${client.config.static.logChannels.join_leave}`)
	}
	
	
}

async function delWelcomeMessage(chan, userId) {
	chan.messages.fetch().then(messages => {
		messages.map(x => {
			if (!x.mentions) return;
			x.mentions.users.map(y => {
				if (y.id === userId)
					x.delete().catch(e => { })
			});
		});
	})
}