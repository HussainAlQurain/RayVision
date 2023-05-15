import { Response, Request } from "express";
import Dota from "../models/dota";

const dota = new Dota();

export class DotaHandler {
    
    //send all live matches to client
    async show(req: Request, res: Response) {
        try{
            const data = await dota.get_live_matches();
            res.status(200).json({body: `${JSON.stringify(data)}`});
        }
        catch (error) {
            res.status(500).json(error);
        }
    }

}