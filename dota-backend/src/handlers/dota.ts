import { Response, Request } from "express";
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
            const data = await dota.searchLiveGameByAccountId(req.params.id);
            setTimeout(() => {
                res.status(200).json({body: `${JSON.stringify(data)}`});    
            }, 10000);
            
        } catch(err) {
            res.status(500).json(err);
        }
    }

}