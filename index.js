require("dotenv").config(); //moved bot token to use dotenv
//console.log(process.env);
const Discrod = require("discord.js");
const client = new Discrod.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "!";
console.log("bot online")

client.on("messageCreate", (message) => {
  //if the message is from a bot, ignore it
  console.log(`got a message : ${message.content}`);

  if (message.author.bot) return;
  //bot on demande commande start with prefix ! , below code are always-on
  if (!message.content.startsWith(prefix)) {
    const regex = /wincho/;
    if (message.content.toLowerCase().search(regex) >= 0 || message.content.toLowerCase().search(/@wincho/) >= 0) {
      console.log("got message");
      // message.reply("Bruh");
      let rando = Math.floor(Math.random(10)*10); //prevent abuse by Joey
      console.log(`rolled :`, rando);
      if (rando === 7 ) message.reply("Bruh"); 
    }
  } else {
    console.log("got commande line");
    processBotCommande(message);
  }
});

function processBotCommande(message) {
  //the received message containt a commade for the bot to do (prefix !), below are bots functions
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    // message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    message.reply("Pong!");
  }
}


client.login(process.env.BOT_TOKEN);

