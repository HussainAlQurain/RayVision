import { Response, Request, json } from "express";
import Dota from "../models/dota";

const dota = new Dota();

export class DotaHandler {
    async getPlayerLiveMatches(req: Request, res: Response) {
        try {
            const accountId = req.params.id;
            const matchData: any = await dota.getMatch(accountId);
            if (matchData && matchData.game_list && matchData.game_list.length > 0) {
                const players = matchData.game_list[0].players || [];
                const accountIds = players.map((player: any) => player.account_id).filter((id: any) => id !== null);

                const playerMatchPromises = accountIds.map((id: any) => dota.processPlayerMatches(id));
                const playerMatches = await Promise.all(playerMatchPromises);

                res.status(200).json(playerMatches);
            } else {
                res.status(404).json({ message: "Player is not in a game or no data found" });
            }
        } catch (err) {
            console.error("Error in getPlayerLiveMatches:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
