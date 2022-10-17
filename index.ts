import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { poolPartyEventService } from "./event-service";
import { poolPartyBotCommandsService } from "./command-service";
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
client.once("ready", async (currClient) => {
  console.log("Pool-part bot is online");
  const commands = await poolPartyBotCommandsService.createAndUpdateCommands(
    currClient
  );
  console.log("Current commands", commands);
});

client.on("interactionCreate", async (interaction) => {
  console.log(interaction);
  if (interaction.isModalSubmit()) {
    await poolPartyEventService.handleEventFormSubmission(interaction);
  } else if (
    interaction.isChatInputCommand() &&
    interaction.commandName === "create-event"
  ) {
    try {
      // Create the modal
      await poolPartyEventService.showEventSubmissionForm(interaction);
    } catch (err: any) {
      console.error(err);
    }
  }
});

client.login(process.env.BOT_TOKEN);
