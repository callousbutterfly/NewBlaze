const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),

	async execute(client, interaction) {
		
		

		//await interaction.reply({ embeds: [embedInfo]});

			
	await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

	const embedInfo = new EmbedBuilder()
	.setTitle('🏓 Pong!')
	.setColor(0x2f6fab)
	.setDescription(`Websocket Responded in **${client.ws.ping}ms**\nClient Responded in: **${ping}ms**`);

	await interaction.editReply({ embeds: [embedInfo]});
    //interaction.editReply(
     // `Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`
    //);
	},
};