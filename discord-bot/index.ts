import { Client, GatewayIntentBits, GuildScheduledEvent, GuildScheduledEventStatus, Interaction, Partials } from "discord.js"
import * as dotenv from "dotenv"
import { postgress } from "./db/postgress"
import { commandService } from "./services/command-service"
import { eventService } from "./services/event-service"
import { updaterService } from "./services/updater-service"
import * as path from "path"
import { error } from "console"
// init dotenv config
dotenv.config({ path: path.join(__dirname, ".env") })

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
    partials: [Partials.GuildScheduledEvent], //add this section to get additional messages info ex: emoji reactions
})

// *********************
// Subscribe to events
// *********************
client.once("ready", async (currClient: Client) => {
    console.log("Pool-part bot is online")
    const commands = await commandService.createAndUpdateCommands(currClient)
    postgress.initDbConnection()
    console.log("Current commands", commands)
})

client.on("interactionCreate", (interaction: Interaction) => {
    if (interaction.isModalSubmit()) {
        eventService.handleEventFormSubmission(interaction).catch(error=>console.error(error))
    } else if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case "create-event":
                console.log("command: create event")
                eventService.showEventSubmissionForm(interaction).catch(error=>console.error(error))
                break
            case "list-event":
                console.log("command: list event")
                updaterService.listEvent(interaction).catch(error=>console.error(error))
                break
            default:
                console.log("no matching command")
        }
    }
})

client.on("guildScheduledEventUpdate",(event:GuildScheduledEvent<GuildScheduledEventStatus> | null) =>{
    if(event){
        // write code here
    }
})

client.login(process.env.BOT_TOKEN)
