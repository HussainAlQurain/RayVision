import { Response, Request } from "express";
import Dota from "../models/dota";

const dota = new Dota();

export class DotaHandler {
    
    async show(req: Request, res: Response) {
        try{
            dota.connect();
            dota.dotaConnect();
            const data = dota.getPlayerProfile(req.params.id);
            dota.dotaDisconnect();
            dota.disconnect();
            res.status(200).json({message: `${data}`});
        }
        catch (error) {
            res.status(500).json(error);
        }
    }

}