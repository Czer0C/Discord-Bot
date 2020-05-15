const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
	name: 'welcome',
	description: 'Welcome a new member.',
	async execute(message, args)  {		
		const channel = message.guild.channels.cache.find(ch => ch.name === 'general');
		if (!channel) return;

		const canvas = Canvas.createCanvas(770, 1121);
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage('./asset/welcome.jpg');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		
		ctx.beginPath();
		
		// x = avatar.X + radius
		// y = avatar.Y + radius
		// radius = avatar.size - 100
		ctx.arc(435, 465, 65, 0, Math.PI * 2, true);
		
		ctx.closePath();		
		ctx.clip();

		const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
		ctx.drawImage(avatar, 370, 400, 165, 165);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

		channel.send(`Welcome to the server!`, attachment);
	},
};