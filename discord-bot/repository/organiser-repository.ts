import { User } from "discord.js";
import { QueryResult } from "pg";
import { postgress } from "../db/postgress";

class OrganiserRepository {

  public async getOrganiserDBId(user: User): Promise<number> {
    let result = await this.getOrganiser(user);
    if (!result.rows[0]) {
      result = await this.insertOrganiser(user);
      console.log(`New organiser added successfully. DB id: ${result.rows[0]?.id}`);
    }
    const organiserId: number = result.rows[0]?.id;
    return Promise.resolve(organiserId);
  }

  /*
  ** This Method return the name/ID pair of all organiser
  */
  public getOrganiserNameList():Promise<QueryResult> {
      return postgress.dbClient.query({
        text: 
        `
        SELECT organiser_name 
        FROM public.organiser
        ORDER BY id ASC
        `,
      });
  }

  /*
  ** This Method search the DB using a given discord# number
  */
  public getOrganiser(user: User):Promise<QueryResult> {
    return postgress.dbClient.query(`SELECT * FROM public.organiser
        WHERE organiser_discord_ref = ${user.id}`);
  }

  public insertOrganiser(user: User):Promise<QueryResult> {
    return postgress.dbClient.query(
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
}

export const organiserRepository: OrganiserRepository =
  new OrganiserRepository();
