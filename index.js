///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////				
					
					require('dotenv').config();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const mail_id = process.env.mail;
const pass = process.env.pass;

const token = process.env.token;
const clientId = process.env.clientId;
const guildId = process.env.guildId;
const gecwydian = process.env.gecwydian;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();

const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '9' }).setToken(token);

const { Routes } = require('discord-api-types/v9');

const { SlashCommandBuilder, bold, italic, strikethrough, underscore, spoiler, quote, blockQuote  } = require('@discordjs/builders');

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: mail_id, pass: pass } });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const CODES = {};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const mail = (destination, code) => {
    let mailOptions = {
        from: mail_id,
        to: destination,
        subject: 'CODE FOR DISCORD SERVER VERIFICATION',
        html: `
        <h2>👋 GREETINGS FROM VA-ZEER (BOT)</h2><br>
        <h3>TO VARIFY THAT YOU ARE FROM GEC WAYANAD TYPE</h3>
        <br><b style="color: red; text-decoration: underline;"><h1>/got_code ${code}</h1><b><br>
        <h3>IN ANY OF THE CHANNELS OF TINKERHUB GECW'S DISCORD SERVER.<h3>`
    };
	
	return new Promise((reolve, reject) => {
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				reject('Failed to send mail 😐');
			} else {
				//console.log('Email sent: ' + info.response);
				reolve('Mail with a verification code has been send succesfully 😃');
			};
		});
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const commands = [
	new SlashCommandBuilder()
		.setName('verify').setDescription('initialize verification as a gecwian through college mail id')
		.addStringOption(option =>
			option.setName('e-mail')
				.setDescription('your mail-id on the gecwyd.ac.in domain')
				.setRequired(true)),
	new SlashCommandBuilder()
	.setName('got_code').setDescription('to authenticate the entered mail id (after getting code in mail inbox)')
	.addNumberOption(option =>
		option.setName('code')
			.setDescription("code after the '/got_code' from mail recieved")
			.setRequired(true)),
].map(command => command.toJSON());

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	console.log('INCOMING COMMAND: ' + commandName)

	switch (commandName){
		case 'verify':
			let verifier_id = interaction.user.id;
			let mailId = interaction.options._hoistedOptions[0].value;
			if (mailId.endsWith('@gecwyd.ac.in')){
				await interaction.deferReply();
				let code = Math.floor((Math.random() * 9990) + 1010).toString();
				CODES[verifier_id] = code;
				console.log(code)
				mail(mailId, code).then(r => {
					interaction.editReply({ 
						content: r, 
						ephemeral: true 
					});
				}).catch(e => {
					interaction.editReply({ 
						content: e, 
						ephemeral: true 
					});
				});
			} else {
				interaction.reply({ 
					content: 
`🐱‍🚀 Mail ID should end with "@gecwyd.ac.in"
${mailId} doesn't looks like so...`, 
					ephemeral: true 
				});
			};
			break;

		case 'got_code':
			let user_id = interaction.user.id;
			let code = interaction.options._hoistedOptions[0].value;
			if (CODES[user_id] == code){
				let GECWIAN_ROLE = interaction.guild.roles.cache.find(r => r.id === gecwydian);
				interaction.member.roles.add(GECWIAN_ROLE);
				interaction.reply({ 
					content:
`🎊🎉🎉🎊
RESPECT + +
WELCOME TO
GECWIAN CLUB`, 
					ephemeral: true 
				});
			} else {
				interaction.reply({ 
					content: 
`WOOPS..🤖
THAT'S NOT WHAT I SEND.
CONSIDER RETYPING.`, 
					ephemeral: true 
				});
			};

		default:
			break;
	};
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.token);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
	res.send(`
	SERVER IS LISTENING \n
	USERS: ${Object.keys(CODES)} \n
	CODES: ${Object.values(CODES)} \n
	`);
});
app.listen(3000, console.log('LISTENING @3000'))
