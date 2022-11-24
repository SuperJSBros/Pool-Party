import { GuildScheduledEvent, User } from "discord.js";
import { QueryResult } from "pg";
import { postgress } from "../db/postgress";

class EventRepository {
  public getEvents(): Promise<QueryResult> {
    let res = postgress.dbClient.query({
      text: `
          SELECT *
          FROM public.event
          WHERE event_start >= now()
          ORDER BY event_start ASC
          `,
    });
    return res;
  }

  public updateEvent(event: GuildScheduledEvent): void {
    const eventStartDateStr = new Date(
      event.scheduledStartTimestamp!
    ).toISOString();
    postgress.dbClient
      .query({
        text: `
            UPDATE public.event
            SET 
            event_name='${event.name}',
            event_desc='${event.description}',
            event_start='${eventStartDateStr}'
            WHERE event_discord_ref=${event.id}
          `,
      })
      .then((result) => {
        console.log(
          `Number of events updated for event_discord_ref ${event.id}: ${result.rowCount}`
        );
      });
  }

  public createEvent(
    event: GuildScheduledEvent,
    minPeopleInput: number,
    eventStartDate: Date,
    messageId: string,
    organiserDbId: number
  ): void {
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
        );
      });
  }
}

export const eventRepository: EventRepository = new EventRepository();
