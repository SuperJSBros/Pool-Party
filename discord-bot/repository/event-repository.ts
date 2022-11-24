import { GuildScheduledEvent, User } from "discord.js";
import { QueryResult } from "pg";
import { postgress } from "../db/postgress";

class EventRepository {
  
    public async getEvent(){
        let res = postgress.dbClient.query({
          text: 
          `
          SELECT *
          FROM public.event
          WHERE event_start >= now()
          ORDER BY event_start ASC
          `,
        })
        return res
    }

    public async createEvent(
        event: GuildScheduledEvent,
        minPeopleInput: number,
        eventStartDate: Date,
        messageId: string,
        organiserDbId: number
    ) {
        postgress.dbClient
            .query(
                `
    INSERT INTO public.event (
      "event_discord_ref",
      "event_name",
      "event_desc",
      "event_min_ppl",
      "event_start",
      "message_discord_ref",
      "organiser_id"
      )
      VALUES(
        ${event.id},
        '${event.name}',
        '${event.description}',
        ${minPeopleInput},
        '${eventStartDate.toISOString()}',
        ${messageId},
        ${organiserDbId})
        RETURNING id;`
            )
            .then((result) => {
                console.log(
                    `New event added successfully. DB id: ${result.rows[0]?.id}`
                )
            })
    }
}

export const eventRepository: EventRepository = new EventRepository();
