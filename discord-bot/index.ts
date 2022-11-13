import { Client, GatewayIntentBits, Interaction } from "discord.js";
import * as dotenv from "dotenv";
import { postgress } from "./db/postgress";
import { eventRepository } from "./repository/event-repository";
import { commandService } from "./services/command-service";
import { eventService } from "./services/event-service";
import { updaterService } from "./services/updater-service";
import * as path from "path";
// init dotenv config
dotenv.config({ path: path.join(__dirname, ".env") });

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
client.once("ready", async (currClient: Client) => {
    console.log("Pool-part bot is online");
    const commands = await commandService.createAndUpdateCommands(currClient);
    postgress.initDbConnection();
    console.log("Current commands", commands);
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isModalSubmit()) {
        await eventService.handleEventFormSubmission(interaction);

    } else if (interaction.isChatInputCommand()) {
        try {
            switch (interaction.commandName) {
                case "create-event":
                    console.log("command: create event");
                    await eventService.showEventSubmissionForm(interaction);
                    break;
                case "list-event":
                    console.log("command: list event");
                    await updaterService.listEvent(interaction);
                    break;
                default:
                    console.log("no matching command");
            }
        } catch (err: any) {
            console.error(err);
        }
    }
});

client.login(process.env.BOT_TOKEN);
