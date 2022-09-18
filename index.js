require("dotenv").config(); //moved bot token to use dotenv
// console.log(process.env);
const Discrod = require("discord.js");
const client = new Discrod.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "!";

client.on("messageCreate", (message) => {
  //if the message is from a bot, ignore it
  if (message.author.bot) return;
  //bot on demande commande start with prefix ! , below code are always-on
  if (!message.content.startsWith(prefix)) {
    const regex = /wincho/;
    if (message.toLowerCase().search(regex) >= 0 || message.toLowerCase().search(/@wincho/) >= 0) {
      if (Math.floor(Math.random(10) === 7 )  return "bruh";
    }
  } else {
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
