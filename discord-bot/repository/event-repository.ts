import { GuildScheduledEvent, User } from "discord.js";
import { postgress } from "../db/postgress";
import { organiserRepository } from "./organiser-repository";

class EventRepository {
  public async createEvent(
    event: GuildScheduledEvent,
    minPeopleInput: number,
    eventStartDate: Date,
    user: User,
    messageId: string
  ) {
    const organiserId = await organiserRepository.getOrganiserDBId(user);
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
        ${organiserId})
        RETURNING id;`
      )
      .then((result) => {
        console.log(`New event added successfully. DB id: ${result.rows[0]?.id}`);
      });
  }
}

export const eventRepository: EventRepository = new EventRepository();
