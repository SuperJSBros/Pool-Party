import { Client, GatewayIntentBits, Interaction } from "discord.js";
import * as dotenv from "dotenv";
import { eventService } from "./services/event-service";
import { commandService } from "./services/command-service";

// init dotenv config
dotenv.config({ path: __dirname + "/.env" });

// create new discord client with permission
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  // partials: [Partials.Message, Partials.Channel, Partials.Reaction], //add this section to get additional messages info ex: emoji reactions
});

// *********************
// Subscribe to events
// *********************
client.once("ready", async (currClient:Client) => {
  console.log("Pool-part bot is online");
  const commands = await commandService.createAndUpdateCommands(
    currClient
  );
  console.log("Current commands", commands);
});

client.on("interactionCreate", async (interaction:Interaction) => {
  if (interaction.isModalSubmit()) {
    await eventService.handleEventFormSubmission(interaction);
  } else if (
    interaction.isChatInputCommand() &&
    interaction.commandName === "create-event"
  ) {
    try {
      await eventService.showEventSubmissionForm(interaction);
    } catch (err: any) {
      console.error(err);
    }
  }
});

client.login(process.env.BOT_TOKEN);
