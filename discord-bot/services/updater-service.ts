import { rejects } from "assert"
import { postgress } from "../db/postgress"
import {EmbedBuilder } from "discord.js";

/**
 * Query database for information to display in the CLI
 *
 */

class UpdaterService {
    public listEvent(interaction: any) {
        console.log("Upcoming event are : ...")
        this.interactionReply(interaction, "test");
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

    //interaction reply of bot messages
    private interactionReply(interaction: any, message: string){
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(message),
            ],
            ephemeral: true
        });

    }
}





export const updaterService: UpdaterService = new UpdaterService()
