import { rejects } from "assert";
import { postgress } from "../db/postgress";

/**
 * Query database for information to display in the CLI
 *
 */

class UpdaterService {
    public listEvent() {
        console.log("Upcoming event are : ...");
        this.readDatabase();
    }

    private async readDatabase() {
        let result = await postgress.dbClient.query(
            `
            SELECT *
            FROM public.event
            WHERE event_start >= now()
            ORDER BY event_start ASC
            `
        );
        for(const [key, value] of Object.entries(result.rows)) {
            console.log(`${key} and ${value.event_name}`);
            //console.log(value);
        }
        return result;
    }
}

export const updaterService: UpdaterService = new UpdaterService();
