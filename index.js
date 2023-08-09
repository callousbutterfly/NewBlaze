// Require the necessary discord.js classes
const fs = require('node:fs');

const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Message } = require('discord.js');
const { token } = require('./config.json');
let { newChannelName } = require('./commands/Basic/namechange');


//Database
const Sequelize = require('sequelize');
const axios = require('axios');
const { DataTypes } = require('sequelize');


let channelName = "name-and-number";

// Create a new client instance
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
] });


// DATABASE


	const sequelize = new Sequelize('postgres_blaze', 'postgres', 'raspberry2', {
		host: 'localhost',
		dialect: 'postgres',
		logging: false,
		// SQLite only
		//storage: 'database.sqlite',
		
	});

	try {
		sequelize.authenticate().then(m => {
			console.log("Successfully connected to the database.");
		});

	} catch (error) {
		console.error("Unable to connect to the database: ", error);
	}

	const Vote = sequelize.define("Sequelize", {
		userId: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		pollId: DataTypes.BIGINT,
		vote: DataTypes.SMALLINT
	})
	
	

	

//END DATABASE

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;
	//console.log(interaction);
});


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.on(Events.MessageCreate, message =>{
    console.log(channelName);
	console.log("New Channel:" + global.newChannelName);
    if(message.channel.name === channelName || message.channel.name === global.newChannelName){
        if(message.content.includes('|')){
            let target = message.author;
            const member = message.guild.members.cache.get(target.id);
            //const memUser = message.guild.members.cache.get(target);
           // const owner = message.guild.members.cache.find(
                //(member) => member.id === message.guild.ownerId
           // );
            if (!member.displayName.includes("|")) {
                    member.setNickname(message.content).catch((error) => {});
                    //interaction.reply({content:"Nickname Successfully Changed!", ephemeral: true});
                   // console.Log("Succesfully Changed")
            }
        }
    }
})

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);