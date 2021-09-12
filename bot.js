// const config = require('./config.json');

const BOT_TOKEN = "ODg2MDk5OTA2MTI3ODg4NDM0.YTwq2A.N6HEYJFYK8VQzr-FYWZ5cP6VUCw";
const CLIENT_ID = '123456789012345678';
const GUIL_ID = '876543210987654321';

const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ] 
});
const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUIL_ID),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async msg => {
  //console.log(msg)
  if (msg.content === 'ping') {
    await msg.reply('Pong!');
  }
});

client.login(process.env.BOT_TOKEN);