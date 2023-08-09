const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('namechange')
		.setDescription('changes name channel')
		.addChannelOption(option =>
			option.setName('input')
			.setDescription('Change Channel Name')
			.setRequired(true)),

	async execute(client, interaction) {
		var tempChannel = interaction.options.getChannel('input').name
		global.newChannelName = tempChannel;

		interaction.reply(`Name Changed to ${newChannelName}`);

	}
};