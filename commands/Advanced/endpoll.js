const { SlashCommandBuilder } = require('discord.js');

const {MessageEmbed} = require('discord.js');
const Vote = require('../../index.js');
const { Op } = require('sequelize');
const { createErrorEmbed } = require('../../util/embedFactory.js')



const run = async (client, interaction, guildID) => {
    const channel = await client.channels.fetch(interaction.channelId);



    

    const messageFetch = await channel.messages.fetch({ limit: 1 });

    const message = messageFetch.first();

    if (message.embeds.length === 0 || (!message.embeds[0].title.includes("Application"))) {
        return interaction.reply({embeds: [createErrorEmbed(
            "No poll found",
            "Are you sure a poll is running in this channel?"
        )]})

    }

    let allVotes = await Vote.findAll({
        attributes: ["vote", "pollId"],
        where: {
            pollId: {
                [Op.eq]: message.id,
            },
        },
    });

    let forVotes = allVotes.filter((v) => v.vote === 1).length;
    let againstVotes = allVotes.filter((v) => v.vote === -1).length;

    const result =
        forVotes > againstVotes
            ? "Accepted"
            : forVotes < againstVotes
            ? "Denied"
            : "Tied";
    const color =
        forVotes > againstVotes
            ? 0x00c851
            : forVotes < againstVotes
            ? 0xc10037
            : 0x0d2139;

    await message.edit({
        embeds: [
            message.embeds[0]
                .setColor(color)
                .setTitle(message.embeds[0].title + ` - ${result}`),
        ],
        components: [],
    });

    await message.thread?.send({
        embeds: [
            new MessageEmbed()
                .setTitle("🗄️ Thread Archived")
                .setColor(0x0d2139),
        ],
    });

    await message.thread?.setArchived(true);

    await interaction.reply({
        content: "Successfully ended the current poll.",
        ephemeral: true,
    });
};
/*
module.exports = {
    name: "endpoll",
    description: "Attempts to end the current application poll",
    perm: "ADMINISTRATOR",
    options: [],
    async execute(client, interaction) {
        run;
    }
};
*/

module.exports = {
    data: new SlashCommandBuilder()
		.setName('endpoll')
		.setDescription('Attempts to end the current application poll'),

    async execute() {
        run;
    }
};
