import { User } from "discord.js";
import { postgress } from "../db/postgress";

class OrganiserRepository {
  public async getOrganiserDBId(user: User): Promise<number> {
    let result = await postgress.dbClient.query(`SELECT * FROM public.organiser
        WHERE organiser_discord_ref = ${user.id}`);
    if (!result.rows[0]) {
      result = await postgress.dbClient.query(
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
      console.log(`New organiser added successfully. DB id: ${result.rows[0]?.id}`);
    }
    const organiserId: number = result.rows[0]?.id;
    return Promise.resolve(organiserId);
  }
}

export const organiserRepository: OrganiserRepository =
  new OrganiserRepository();
