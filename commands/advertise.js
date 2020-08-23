
const Discord = require("discord.js");
const runningbotnow = new Set();
const twohourwait = new Set();
const cooldown = 7200;

let ChannelID = "746339469178699886"; //Specifies id of the channel you want to send the message to.
let GuildID = "745787068843688017"; //Specifies id of the guild you want to send the message to.
let AdvertisingCommandChannel = "746507960791859370";

module.exports.run = async (bot, message, args) => {
    const filter = m => m.author.id === message.author.id; // Makes sure it collects only the user who ran the command's messages.
    let title = ""; //The placeholder for the collected message.
    let link = "";
    let desc = "";
    let cost = "";
    let category = "";
    const TimeOutMessage = new Discord.MessageEmbed()
    .setTitle("You ran out of time to answer, please re-run the command and try again!")
    .setColor(1752220);

    const SuccessfulPost = new Discord.MessageEmbed()
    .setTitle("Your advertisement submission for Indie Game Spotlight was accepted.")
    .setColor(1752220);

    const FailPost = new Discord.MessageEmbed()
    .setTitle("Your advertisement submission for Indie Game Spotlight was denied, please make sure it follows our community rules and try again.")
    .setColor(1752220);

    const SentPost = new Discord.MessageEmbed()
    .setTitle("Successfully sent your advertisement for moderation.");

    const WrongCategory = new Discord.MessageEmbed()
    .setTitle("Did not input a correct category, please re-run the command and try again.")
    .setColor(1752220);

    const Deleting = new Discord.MessageEmbed()
    .setTitle("Cancelled advertisement submission.")
    .setColor(1752220);

    if(message.channel.id != "746507960791859370") 
    {
        console.log(message.channel.id + "ads not allowed");
        message.reply("You cannot advertise here.");
        message.delete();
        return;
    }

    if(runningbotnow.has(message.author.id)) return message.reply('You have already started the advertising process, either check your direct messaged and finish, or wait for it to time out after ten minutes.');
    if(twohourwait.has(message.author.id)) return message.reply('You need to wait your two hours before submitting an advertisement again.');



    let avatar = message.author.avatarURL({
        size: 2048
    });


    let Prompt1 = new Discord.MessageEmbed()
        .setTitle("Title")
        .setDescription(
            "Please specify the title of the advertisement."
        )
        .setColor(1752220)
        .setFooter(`Expires 10 minutes after this was sent.`)
        .setTimestamp(); //The embed that'll be sent for the first prompt.
        

    message.channel.send("Redirected prompt to your DMs. If you didn't receive a DM from me, check your privacy settings and try again."); //Lets user know that it is now in their dms.

   console.log(message.author.id);
    runningbotnow.add(message.author.id);
    
    message.author.send(Prompt1).then(p1 => { //Sends the prompt to the user.
        let Title = new Discord.MessageCollector(p1.channel, filter, {
            max: 1,
            time: 600000 //Time that the user has to submit an answer. Set to 3 minutes rn.
        }); //Sets up the collector.

        Title.on("collect", async collectedMessage => { //Turns on the collector.
            if (collectedMessage.length >= 2048) { //Warns user if they reach the max character length.
                collectedMessage.reply(
                    "The message you sent is too long. Please try running the command again."
                );
                runningbotnow.delete(message.author.id);
                Title.stop(); //Stops the collector.
                return;
            }
            Title.stop(); //Stops the collector.
            title = collectedMessage; //Replaces the placeholder with the collected message.

            let Prompt2 = new Discord.MessageEmbed()
            .setTitle("Link")
            .setDescription(
                "Please specify the link to your advertisement"
            )
            .setColor(1752220)
            .setFooter(`Expires 10 minutes after this was sent.`)
            .setTimestamp();

            p1.channel.send(Prompt2).then(p2 => {
            let Link = new Discord.MessageCollector(p2.channel, filter, {
                max: 1,
                time: 600000
        });

            Link.on("collect", async collectedMessage => {

                if(collectedMessage.length >= 2048) {
                    collectedMessage.reply("The message you sent is too long. Please try again.")
                    runningbotnow.delete(message.author.id);
                    Link.stop();
                    return;
                }
                Link.stop();
                link = collectedMessage;

                let Prompt3 = new Discord.MessageEmbed()
                .setTitle("Description")
                .setDescription(
                    "Please enter the description for your advertisement."
                )
                .setColor(1752220)
                .setFooter(`Expires 10 minutes after this was sent.`)
                .setTimestamp();


                p2.channel.send(Prompt3).then(p3 => {
                let Description = new Discord.MessageCollector(p3.channel, filter, {
                   max: 1,
                   time: 600000
                });

                Description.on("collect", async collectedMessage => {

                if(collectedMessage.length >= 2048) {
                    collectedMessage.reply("The description you set is too long. Please try again.")
                    runningbotnow.delete(message.author.id);
                    Description.stop();
                    return;
                }
                Description.stop();
                desc = collectedMessage;

                let Prompt4 = new Discord.MessageEmbed()
                .setTitle("Cost")
                .setDescription("Please enter how much your promoted subject costs.")
                .setColor(1752220)
                .setFooter(`Expires 10 minutes after this was sent.`)
                .setTimestamp();

                p3.channel.send(Prompt4).then(p4 => {
                let Cost = new Discord.MessageCollector(p4.channel, filter, {
                max: 1,
                time: 600000
                });

                Cost.on("collect", async collectedMessage => {

                    if(collectedMessage.length >= 2048) {
                        collectedMessage.reply("The cost you set is too high. Please try again.")
                        runningbotnow.delete(message.author.id);
                        Cost.stop();
                        return;
                    }
                    Cost.stop();
                    cost = collectedMessage;


                    let Prompt5 = new Discord.MessageEmbed()
                    .setTitle("Category")
                    .setDescription("Please enter which of the following categories your advertisement fits into best. android, ios, pc, other.")
                    .addField("WARNING", "adding the wrong category will result in your advertisement not being accepted.")
                    .setColor(1752220)
                    .setFooter(`Expires 10 minutes after this was sent.`)
                    .setTimestamp();

                    p4.channel.send(Prompt5).then(p5 => {
                    let Category = new Discord.MessageCollector(p5.channel, filter,  {
                    max: 1,
                    time: 600000
                    });

                    Category.on("collect", async collectedMessage => {
                    
                   let categoryconf = collectedMessage.content.toLowerCase();
                   console.log(categoryconf);
                   if(categoryconf != "android" && categoryconf != "ios" && categoryconf != "pc" && categoryconf != "other") {
                       collectedMessage.reply(WrongCategory);
                       return runningbotnow.delete(message.author.id);
                   }
                   Category.stop();
                   category = categoryconf;

                   let Prompt6 = new Discord.MessageEmbed()
                   .setTitle("Do you wish to send this for review?")
                   .setAuthor("Please reply with yes or no.")
                   .addField("Cost:", cost)
                   .addField("Description:", desc)
                   .addField("Link:", `[${title.toString()}](${link.toString()})`)
                   .addField("Posted By:", `<:discordlogo:747205412922720296> - <@${collectedMessage.author.id}>`)
                   .setColor(1752220)
                   .setFooter(`Expires 10 minutes after this was sent.`)
                   .setTimestamp();

                   p5.channel.send(Prompt6).then(p6 => {
                   let YorN = new Discord.MessageCollector(p5.channel, filter, {
                   max: 1,
                   time: 600000
                   }) 

                   YorN.on('collect', async collectedMessage =>{
                    let messagetolower = collectedMessage.content.toLowerCase();
                    if(messagetolower === "no") {
                        collectedMessage.reply(Deleting);
                        runningbotnow.delete(message.author.id);
                        return;
                    }

        
            let sellingembed = new Discord.MessageEmbed() //Creates the embed that'll be sent.
                .setAuthor(`By ${message.author.tag}`, avatar)
                .setTitle(title)
                .addField("Cost:", cost)
                .addField("Description:", desc)
                .addField("Link:", `[${title.toString()}](${link.toString()})`)
                .addField("Posted By:", `<@${collectedMessage.author.id}>`)
                .setColor(1752220)
                .setFooter(`category: ${category}`);
                

            bot.guilds.cache
                .get(GuildID) //Gets the guild.
                .channels.cache.get(ChannelID) //Gets the channel.
                .send(sellingembed.setTimestamp()).then(async posted => {
                    message.author.send (
                        SentPost //Let's the user know that their message was sent.
                    );

                    await posted.react('✅');
                    await posted.react('❌');
                    

                   if(message.author.id != '722797856162971668')
                   {
                        twohourwait.add(message.author.id);
                   }
                   setTimeout(() => { 
                   twohourwait.delete(message.author.id);                    
                   }, cooldown * 1000)
                   runningbotnow.delete(message.author.id);

                    const filter = (reaction, user) => user.id != bot.user.id;
                    const options = {
                        errors: ["time"],
                        time: 86400000,
                        max: 1
                    };
                

               posted.awaitReactions(filter, options)
               .then(collected => {
            const first = collected.first();

            if(first.bot) return;
            console.log(posted.content);
            if(first.emoji.name == '✅') {

const responsechannel =  bot.channels.cache.get(ChannelID);
const androidchannel = bot.channels.cache.get('745787421056172093');
const ioschannel = bot.channels.cache.get('745787459513745428');
const pcchannel = bot.channels.cache.get('745787495098351696');
const otherchannel = bot.channels.cache.get('745787545719144518');


if(category == "android"){
    androidchannel.send(sellingembed.setTimestamp());
}
else if(category == "ios"){
    ioschannel.send(sellingembed.setTimestamp());
}
else if(category == "pc"){
    pcchannel.send(sellingembed.setTimestamp());
}
else if(category == "other"){
    otherchannel.send(sellingembed.setTimestamp());
}



posted.delete();
let response = responsechannel.send("```Submission Accepted.```").then(mesg => {
    mesg.delete({timeout: 5000,}).catch("error while deleting");
    });


collectedMessage.channel.send(SuccessfulPost.setTimestamp());
}
else {

posted.delete();
const responsechannel =  bot.channels.cache.get(ChannelID);


let response = responsechannel.send("```Submission Denied.```").then(mesg => {
mesg.delete({timeout: 5000,}).catch("error while deleting");


});
collectedMessage.channel.send(FailPost.setTimestamp());

}
               })
                .catch(console.error);

                })
                .catch(console.error())
            });
            YorN.on('end', async (col, res) => {
            if(!col.length && res == "time") {
            p1.channel.send(TimeOutMessage);
            runningbotnow.delete(message.author.id);
            }
            })
                });
            });
            Category.on('end', async (col, res) => {
                if(!col.length && res == "time") {
                    p1.channel.send(TimeOutMessage);
                    runningbotnow.delete(message.author.id);
                }
            })
        });
    });
    Cost.on('end', async (col, res) => {
        if(!col.length && res == "time") {
            p1.channel.send(TimeOutMessage);
            runningbotnow.delete(message.author.id);
        }
    })
        });
        });
        Description.on('end', async (col, res) => {
            if(!col.length && res == "time") {
            p1.channel.send(TimeOutMessage);
            runningbotnow.delete(message.author.id);
            }
        })
        });
        });
        Link.on('end', async (col, res) => {
if(!col.length && res == "time") {
    p2.channel.send(TimeOutMessage);
    runningbotnow.delete(message.author.id);
}
        })
     });
     });
     Title.on('end', async (col, res) => {
     if(!col.length && res == "time") {
      p1.channel.send(TimeOutMessage);
      runningbotnow.delete(message.author.id);
     }
     })
    });
};

module.exports.help = {
    name: "advertise"
};