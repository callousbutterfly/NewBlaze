const { SlashCommandBuilder } = require('discord.js');
const { applicationList } = require('../../util/applicationRetriever.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Vote = require('../../index.js');
const { nanoid } = require('nanoid');

const createApplicationEmbed = (application, likes, dislikes) => {
    return new MessageEmbed()
        .setTitle(`${application.teamName} Application`)
        .setURL("https://pastebin.com/kBstdfvG")
        .setColor(0xff6c09)
        .setFields([
            {
                name: `What is your team name / number?`,
                value: `${application.teamName}\n\n**Social Media**\n\`${application.contact}\``,
                inline: true,
            },
            {
                name: `Team Member Count:`,
                value: `${application.teamCount}\n\n**Alliance**\n${application.alliance}`,
                inline: true,
            },
            {
                name: `\u200b`,
                value: `\u200b`,
                inline: false,
            },
            {
                name: `Tournament Champions`,
                value: `1\n\n**Design Awards**\n${application.designAwards}`,
                inline: true,
            },
            {
                name: `Excellence Awards`,
                value: `1\n\n**Season Record**\n${application.seasonRecord}`,
                inline: true,
            },
            {
                name: `\u200b`,
                value: `\u200b`,
                inline: false,
            },
            {
                name: `Why do you want to join the Blaze alliance?`,
                value: `${application.whyJoin}\n\u200b`,
            },
            {
                name: `Why should we consider your team to join the Blaze alliance?`,
                value: `${application.whyConsider}\n\u200b`,
            },
            {
                name: `What are your goals for the Spin Up season?`,
                value: `${application.goals}\n\u200b`,
            },
            {
                name: `What can your team provide to the alliance to improve it?`,
                value: `${application.contributions}\n\u200b`,
            },
            {
                name: `Robot Image`,
                value: `${application.image}\n\u200b`,
            },
            {
                name: `👍 \u200b\u200b\u200bLikes`,
                value: `${likes.length}[${
                    (
                        (likes.length / (likes.length + dislikes.length) || 0) *
                        100
                    ).toFixed(2) + "%"
                }]`,
                inline: true,
            },
            {
                name: `👎 \u200b\u200b\u200bDislikes`,
                value: `${dislikes.length}[${
                    (
                        (dislikes.length / (likes.length + dislikes.length) ||
                            0) * 100
                    ).toFixed(2) + "%"
                }]`,
                inline: true,
            },
        ]);
};

const run = async (client, interaction, guildID) => {

    const id = nanoid();

    console.log(interaction.options);

    const team = interaction.options.getString("team");

    console.log(applicationList);

    const application = applicationList.find(t => t.teamName === team);

    let likes = [];
    let dislikes = [];

    const content = createApplicationEmbed(application, likes, dislikes);

    const replyMessage = "Successfully started the next poll.";

    await interaction.reply({
        content: replyMessage,
        ephemeral: true,
        // components: [row],
        fetchReply: true,
    });

    const channel = await client.channels.fetch(interaction.channelId);

    let row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`approve-${id}`)
            .setEmoji("👍")
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId(`neither-${id}`)
            .setEmoji("▫️")
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId(`deny-${id}`)
            .setEmoji("👎")
            .setStyle("SECONDARY")
    );

    const message = await channel.send({
        embeds: [content],
        components: [row],
    });

    const thread = await message.startThread({
        name: `Discussion of ${application.teamName} Application`,
        autoArchiveDuration: 10080,
    });

    row.addComponents(
        new MessageButton()
            .setStyle("LINK")
            .setLabel("View Discussion")
            .setURL(
                `https://discord.com/channels/${message.guildId}/${thread?.id}`
            )
    );

    await message.edit({ embeds: [content], components: [row] });

    const filter = (i) =>
        i.customId === `approve-${id}` ||
        i.customId === `deny-${id}` ||
        i.customId === `neither-${id}`;

    const collector = interaction.channel.createMessageComponentCollector({
        filter,
    });

    collector.on("collect", async (i) => {
        if (i.customId === `approve-${id}`) {
            const [model, _] = await Vote.upsert({
                userId: i.user.id,
                pollId: message.id,
                vdote: 0,
            });

            model.vote = 1;
            await model.save();
        }

        if (i.customId === `deny-${id}`) {
            const [model, _] = await Vote.upsert({
                userId: i.user.id,
                pollId: message.id,
                vote: 0,
            })

            model.vote = -1;
            await model.save();
        }

        if (i.customId === `neither-${id}`) {
            const [model, _] = await Vote.upsert({
                userId: i.user.id,
                pollId: message.id,
                vote: 0,
            })

            model.vote = 0;
            await model.save();
        }

        let allVotes = await Vote.findAll({
            attributes: ["vote"],
        });

        likes = allVotes.filter((v) => v.vote === 1);
        dislikes = allVotes.filter((v) => v.vote === -1);

        await i.update({
            embeds: [createApplicationEmbed(application, likes, dislikes)],
        });
    });

    collector.on("end", (collected) => {
        console.log("Collection ended.");
    });
};

module.exports = {
    data: new SlashCommandBuilder()
		.setName('nextpoll')
		.setDescription('Starts the next application poll')
		.addStringOption(option =>
			option.setName('team')
			.setDescription('Target team application')
            .setAutocomplete(true)
			.setRequired(true)),

    async execute() {
        run;
    }
};
