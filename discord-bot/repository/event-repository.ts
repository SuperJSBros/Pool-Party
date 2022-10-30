import { GuildScheduledEvent } from "discord.js";
import { Client } from "pg";

class EventRepository {
  public dbClient!: Client;
  constructor() {}
  public initDbConnection(): void {
    const config = {
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      port: 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PW,
    };
    if (this.dbClient) {
      console.log(
        `A connection to DB ${config.database} has already been established`
      );
      return;
    }

    const client = new Client(config);
    client
      .connect()
      .then(() => {
        this.dbClient = client;
        console.log(
          `Connected to DB ${config.database} on port ${config.port}`
        );
      })
      .catch((e) => console.error(e));
  }

  public createEvent(
    event:GuildScheduledEvent,
    minPeopleInput: string,
    eventStartDate: Date,
    userId: string,
    messageId: string
  ) {
    this.dbClient
      .query(
        `
    INSERT INTO public."Event"(
      "EventID",
      "EventName",
      "Description",
      "MinPeople",
      "StartTime",
      "OrganizerID",
      "MessageID"
      )
      VALUES(
        ${event.id},
        '${event.name}',
        '${event.description}',
        ${minPeopleInput},
        '${eventStartDate.toISOString()}',
        ${userId},
        ${messageId});`
      )
      .then((result) => {
        console.log(result);
      });
  }
}

export const eventRepository: EventRepository = new EventRepository();
