import {
    APIApplicationCommand,
    Client,
    Routes,
    SlashCommandBuilder,
} from "discord.js";

class CommandService {
    /**
     * This function creates and updates all current application commands for the current discord bot
     * @param currClient application client
     * @returns APIApplicationCommand list
     */
    public async createAndUpdateCommands(
        currClient: Client<true>
    ): Promise<APIApplicationCommand[]> {
        const createEventCommand = new SlashCommandBuilder()
            .setName("create-event")
            .setDescription("Creates an event with and chat thread");
        
        const listEventCommand = new SlashCommandBuilder()
            .setName("list-event")
            .setDescription("Show upcoming events");

        // create / update command
        const commands: APIApplicationCommand[] = (await currClient.rest.put(
            Routes.applicationGuildCommands(
                currClient.application.id,
                String(process.env.SERVER_ID) // copied server id
            ),
            { body: [createEventCommand.toJSON(), listEventCommand.toJSON()] }
        )) as APIApplicationCommand[];

        return commands;
    }
}
export const commandService: CommandService = new CommandService();
