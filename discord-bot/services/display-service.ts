//import { postgress } from "./db/postgress";

import { rejects } from "assert";

/**
 * Query database for information to display in the GUI
 *
 */

class DisplayService {
    public listEvent() {
        console.log("Upcoming event are : ...");
    }
}

export const displayService: DisplayService = new DisplayService();
