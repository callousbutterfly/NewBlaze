const MessageEmbed = require('discord.js');

const createErrorEmbed = (title, description, fields = []) => {
    return new MessageEmbed()
        .setTitle(`❌ ${title}`)
        .setColor(0xc10037)
        .setDescription(description)
        .setFields(fields);
};

const createInfoEmbed = (title, description, fields = []) => {
    return new MessageEmbed()
        .setTitle(`${title}`)
        .setColor(0x2f6fab)
        .setDescription(description)
        .setFields(fields);
};

const createSuccessEmbed = (title, description, fields = []) => {
    return new MessageEmbed()
        .setTitle(`${title}`)
        .setColor(0x00c850)
        .setDescription(description)
        .setFields(fields);
};
