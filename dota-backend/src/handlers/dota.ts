import { Response, Request, json } from "express";
import Dota from "../models/dota";

const dota = new Dota();

export class DotaHandler {

    //get all live matches
    async matches(req: Request, res: Response) {
        try{
            const data = await dota.steam_connect();
            res.status(200).json({body: `${JSON.stringify(data)}`});
        }
        catch (error) {
            res.status(500).json(error);
        }
    }

    async search(req: Request, res: Response) {
        try{
            const data: any = await dota.getMatch(req.params.id);
            res.status(200).json({body: `${JSON.stringify(data)}`});
            
        } catch(err) {
            res.status(500).json(err);
        }
    }

}