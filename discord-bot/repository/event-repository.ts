import { GuildScheduledEvent, User } from "discord.js";
import { postgress } from "../db/postgress";

class EventRepository {


  public async createEvent(
    event:GuildScheduledEvent,
    minPeopleInput: string,
    eventStartDate: Date,
    user: User,
    messageId: string
  ) {

   const organiserId = await this.getOrganiserDBId(user)

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
        ${organiserId});`
      )
      .then((result) => {
        console.log(result);
      });
  }

  private async getOrganiserDBId(user:User):Promise<number> {
    let result = await postgress.dbClient.query(`SELECT * FROM public.organiser
    WHERE organiser_discord_ref = ${user.id}`);
    if(!result.rows[0]){
      result = await  postgress.dbClient
      .query(
        `
    INSERT INTO public.organiser (
      "organiser_name",
      "organiser_discord_ref",
      "organiser_reputation"
      )
      VALUES(
        '${user.username}',
        ${user.id},
        ${1})
      RETURNING id;`
      );
    }
    const organiserId:number = result.rows[0]?.id
    return Promise.resolve(organiserId);
  }
}

export const eventRepository: EventRepository = new EventRepository();


