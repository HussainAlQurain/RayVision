import { Response, Request, json } from "express";
import axios from "axios";
import Dota from "../models/dota";
import Long from "long";

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

                // Fetch additional data for each account_id
                const playerInfoPromises = accountIds.map((id: any) =>
                    axios.get(`https://api.opendota.com/api/players/${id}`)
                );
                const playerInfoResponses = await Promise.all(playerInfoPromises);
                const playerInfoData = playerInfoResponses.map((response: any) => response.data);

                // Add additional data to each player object
                // Add optional chaining to safely access nested properties
                for (let i = 0; i < playerMatches.length; i++) {
                    playerMatches[i].leaderboard_rank = playerInfoData[i]?.leaderboard_rank;
                    playerMatches[i].personaname = playerInfoData[i]?.profile?.personaname;
                    playerMatches[i].profileurl = playerInfoData[i]?.profile?.profileurl;
                    playerMatches[i].mmr_estimate = playerInfoData[i]?.mmr_estimate?.estimate;
                    playerMatches[i].avatarfull = playerInfoData[i]?.profile?.avatarfull;
                }

                res.status(200).json(playerMatches);
            } else {
                res.status(404).json({ message: "Player is not in a game or no data found" });
            }
        } catch (err) {
            console.error("Error in getPlayerLiveMatches:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async LastFiveGames(req: Request, res: Response) {
        try{
            const accountId = Number(req.params.id);
            const data: any = await dota.getLastFiveMatches(accountId);
            const matches = data["recent_matches"];
            const matches_ = matches.map((match: { match_id: { low: number; high: number | undefined; unsigned: boolean | undefined; }; }) => new Long(match.match_id.low, match.match_id.high, match.match_id.unsigned));
            const matches__ = matches_.map((match: any) => match.toString());
            res.status(200).json(matches__);
        } catch (err) {
            console.error("Error in getting last five games:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
