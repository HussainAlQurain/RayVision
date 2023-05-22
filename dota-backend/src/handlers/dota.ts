import { Response, Request } from "express";
import Dota from "../models/dota";

const dota = new Dota();

export class DotaHandler {

    //get all live matches
    async matches(req: Request, res: Response) {
        try{
            const data = await dota.getGames();
            res.status(200).json({body: `${JSON.stringify(data)}`});
        }
        catch (error) {
            res.status(500).json(error);
        }
    }

}