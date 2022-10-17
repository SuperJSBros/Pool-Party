import {
  APIApplicationCommand,
  Client,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

class PoolPartyBotCommandsService {
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

    // create / update command
    const commands: APIApplicationCommand[] = (await currClient.rest.put(
      Routes.applicationGuildCommands(
        currClient.application.id,
        String(process.env.SERVER_ID) // copied server id
      ),
      { body: [createEventCommand.toJSON()] }
    )) as APIApplicationCommand[];

    return commands;
  }
}
export const poolPartyBotCommandsService: PoolPartyBotCommandsService =
  new PoolPartyBotCommandsService();
