import { rejects } from "assert"
import { postgress } from "../db/postgress"
import { EmbedBuilder } from "discord.js"
import * as dotenv from "dotenv";
import * as path from "path";
// init dotenv config
dotenv.config({ path: path.join(__dirname, ".env") });

/**
 * Query database for information to display in the CLI
 *
 */
class UpdaterService {
    //Query db and return all upcoming events
    public async listEvent(interaction: any): Promise<any> {
        let result = await postgress.dbClient.query(
            `
            SELECT *
            FROM public.event
            WHERE event_start >= now()
            ORDER BY event_start ASC
            `
        )
        let organiser = await postgress.dbClient.query(
            `
            SELECT organiser_name 
            FROM public.organiser
            ORDER BY id ASC
            `
        );

        let message: string = `There are ${result.rowCount} upcoming event(s) !\n`
        for (const [key, value] of Object.entries(result.rows)) {
            console.log(`${key} : ${value.event_name}`)
            message = [
                message,
                "\n",
                value.event_start.toISOString().substring(0, 10),
                "@",
                value.event_start.toISOString().substring(11, 16),
                " --> ",
                `[${value.event_name}](https://discord.com/channels/${process.env.SERVER_ID}/${value.message_discord_ref})`,
                "  by",
                organiser.rows[value.organiser_id - 1].organiser_name
            ].join(" ")
        }
        this.interactionReply(interaction, message)
    }

    private interactionReply(interaction: any, message: string) {
        interaction.reply({
            embeds: [
                new EmbedBuilder().setColor("Orange").setDescription(message),
            ],
            ephemeral: true,
        })
    }
}

export const updaterService: UpdaterService = new UpdaterService()
