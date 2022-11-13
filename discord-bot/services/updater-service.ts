import { rejects } from "assert"
import { postgress } from "../db/postgress"
import {
    ActionRowBuilder,
    CommandInteraction,
    EmbedBuilder,
    GuildScheduledEvent,
    Message,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    Routes,
    TextInputBuilder,
    TextInputStyle,
  } from "discord.js";

/**
 * Query database for information to display in the CLI
 *
 */

class UpdaterService {
    public listEvent(interaction: any) {
        console.log("Upcoming event are : ...")
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(
                        `LIST EVENT`
                    ),
            ],
            ephemeral: true
        });
        //this.readDatabase();
    }

    private async readDatabase() {
        let result = await postgress.dbClient.query(
            `
            SELECT *
            FROM public.event
            WHERE event_start >= now()
            ORDER BY event_start ASC
            `
        )
        for (const [key, value] of Object.entries(result.rows)) {
            console.log(`${key} and ${value.event_name}`)
            //console.log(value);
        }
        return result;
    }
}





export const updaterService: UpdaterService = new UpdaterService()
