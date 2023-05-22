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
    //send all live matches to client
    // async show(req: Request, res: Response) {
    //     try{
    //         const data = await dota.get_live_matches();
    //         res.status(200).json({body: `${JSON.stringify(data)}`});
    //     }
    //     catch (error) {
    //         res.status(500).json(error);
    //     }
    // }

    // //get all players in a live match using one player's ID
    // async show_players(req: Request, res: Response) {
    //     try{
    //         const data = await dota.get_players(parseInt(req.params.account_id));
    //         res.status(200).json({body: `${JSON.stringify(data)}`});
    //     }
    //     catch (error) {
    //         res.status(500).json(error);
    //     }
    // }

}