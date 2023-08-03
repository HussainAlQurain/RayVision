import { Response, Request, json } from "express";
import Dota from "../models/dota";

const dota = new Dota();

export class DotaHandler {
    async getPlayerLiveMatches(accountId: string) {
        try {
            const matchData: any = await dota.getMatch(accountId);
            if (matchData.body && matchData.body.game_list && matchData.body.game_list.length > 0) {
                const players = matchData.body.game_list[0].players || [];
                const accountIds = players.map((player: any) => player.account_id).filter((id: any) => id !== null);

                const playerMatchPromises = accountIds.map((id: any) => dota.processPlayerMatches(id));
                const playerMatches = await Promise.all(playerMatchPromises);

                return playerMatches;
            }

            return [];
        } catch (err) {
            console.error("Error in getPlayerLiveMatches:", err);
            throw err;
        }
    }

    async search(req: Request, res: Response) {
        try {
            const accountId = req.params.id;
            const matchData: any = await dota.getMatch(accountId);

            // Check if matchData is not available or doesn't contain game data
            if (!matchData.body || !matchData.body.game_list || matchData.body.game_list.length === 0) {
                res.status(404).json({ message: "Player is not in a game" });
                return;
            }

            // Process the live match data and get player matches
            const playerLiveMatches = await this.getPlayerLiveMatches(accountId);
            res.status(200).json({ players: playerLiveMatches });
        } catch (err) {
            console.error("Error in search:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
