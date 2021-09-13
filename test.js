require('dotenv').config();

const token = process.env.token;

////////////////////////////////////////////////

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

////////////////////////////////////////////////

const set_cmd = require('./set_cmd');
set_cmd();

const listen_cmd = require('./listen_cmd');
listen_cmd(client);

//////////////////////////////////////////////

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

//////////////////////////////////////////////