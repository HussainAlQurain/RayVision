import { Response, Request, json } from "express";
import axios from "axios";
import Dota from "../models/dota";
import Long from "long";

interface Hero {
    id: number;
    name: string;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    roles: string[];
}

interface PlayerData {
    status: string;
    value: {
        account_id: number;
        win_rate?: number;
        most_picked_heroes: {
            hero_id: string | number;
            count: number;
            localized_name?: string;
        }[];
        highest_win_rate_hero?: {
            hero_id: string | number;
            win_rate: number;
            localized_name?: string;
        };
        personaname?: string;
        avatarfull?: string;
    };
    reason?: any;
}


const dota = new Dota();

export class DotaHandler {

    async getPlayerLiveMatches(req: Request, res: Response) {
        try {
            const accountId = req.params.id;
            const matchData: any = await dota.getMatch(accountId);
            if (matchData && matchData.game_list && matchData.game_list.length > 0) {
                const players = matchData.game_list[0].players || [];
                console.log("my logsssss", players);
                const accountIds = players.map((player: any) => player.account_id).filter((id: any) => id !== null); 

                const playerMatchPromises = accountIds.map((id: any) => dota.processPlayerMatches(id));
                const playerMatches = await Promise.allSettled(playerMatchPromises);

                // Extract only the successful results and get the 'value' property
                const successfulPlayerMatches = playerMatches
                .filter((result: { status: string; }) => result.status === "fulfilled")
                .map(result => (result as PromiseFulfilledResult<any>).value);

                const finalData = this.enrichData(successfulPlayerMatches);

                res.status(200).json(finalData);
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

    async enrichData(apiResponse: PlayerData[]): Promise<PlayerData[]> {
        // Fetching hero data
        const heroes: { [id: number]: string } = {};
        try {
            const heroesResponse = await axios.get('https://api.opendota.com/api/heroes');
            heroesResponse.data.forEach((hero: Hero) => {
                heroes[hero.id] = hero.localized_name;
            });
        } catch (error) {
            console.error('Error fetching hero data:', error);
        }

        // Fetching player data and enriching the original API response
        const enrichedResponses = await Promise.all(apiResponse.map(async (playerData) => {
            if (playerData.status === 'fulfilled') {
                try {
                    const playerResponse = await axios.get(`https://api.opendota.com/api/players/${playerData.value.account_id}`);
                    playerData.value.personaname = playerResponse.data.profile.personaname;
                    playerData.value.avatarfull = playerResponse.data.profile.avatarfull;

                    // Translate hero_id to its localized_name
                    playerData.value.most_picked_heroes.forEach(hero => {
                        hero.localized_name = heroes[Number(hero.hero_id)];
                    });

                    if (playerData.value.highest_win_rate_hero) {
                        playerData.value.highest_win_rate_hero.localized_name = heroes[Number(playerData.value.highest_win_rate_hero.hero_id)];
                    }

                } catch (error) {
                    console.error(`Error fetching data for account ID ${playerData.value.account_id}:`, error);
                }
            }
            return playerData;
        }));

        return enrichedResponses;
    }
}
