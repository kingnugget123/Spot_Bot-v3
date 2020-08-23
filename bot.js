const Discord = require("discord.js");
const bot = new Discord.Client({ //Specifies your bot user.
	partials: ["MESSAGE", "CHANNEL", "REACTION"]
});
const fs = require("fs");
bot.commands = new Discord.Collection(); //A collection of all your commands.

fs.readdir("./commands/", (err, files) => { //Finds the commands folder.
	if (err) console.log(err); //If there is an error finding the folder.
	let jsfile = files.filter(f => f.split(".").pop() === "js"); //Filters through all the files and only registers JS files.
	if (jsfile.length <= 0) { //If there isn't any context in the JS file it'll log an error.
		console.log("Couldn't find commands.");
		return;
	}
	jsfile.forEach((f, i) => { //Logs all the command files.
		let props = require(`./commands/${f}`);
        console.log(`${f} loaded.`);
		bot.commands.set(props.help.name, props);
	});
});

bot.on("ready", async () => { //Logs when your bot is online.
	console.log(`${bot.user.username} is online!`);
	bot.user.setActivity("INDIE GAME SPOTLIGHT", { type: "PLAYING" }); //Optional
});

bot.on("message", async message => { //This is where it begins to load in commands.

	
	if(message.content.includes("discord.gg/") | message.content.includes("discordapp.com/invite/")) {
		message.reply("No posting server links, i'm one step ahead of you :)");
		message.delete();
	}
	
	if (!message.content.startsWith(botconfig.prefix) || message.author.bot) //Filters to make sure the bot isn't running the commands.
		return;
	if (message.channel.type === "dm") return; //Filters to make sure the command isn't run in a DM.

	let prefix = '?'; //Specifies the prefix from a botconfig.json file. You can also do: let prefix = "?";
	let messageArray = message.content.split(" "); //Splits the command from any other arguments.
	let cmd = messageArray[0]; //Finds the first argument, the command.
	let args = messageArray.slice(1); //Finds the other arguments, the extra stuff. Ex: ?ad Stuff.


    let commandfile = bot.commands.get(cmd.slice(prefix.length)); //Finds the command file in the commands folder for the corresponding command.
    console.log(commandfile);
	if (commandfile) commandfile.run(bot, message, args); //If there is a file for it, it runs the command.
});
bot.login(process.env.BOT_TOKEN); //Logs into your bot using the token stored in the botconfig.json file, you can also do: bot.login("TOKEN");

