import dotenv from 'dotenv';
import axios from 'axios';
import { LiveMatch } from '../types/LiveMatches';
import { Player } from '../types/Player';

dotenv.config();

export default class Dota {
    private baseUrl: string = process.env.DOTA_API_URL || '';


    constructor() {
    
    }

    //Method to get all live matches using OpenDota API
    async get_live_matches(): Promise<LiveMatch[]> {
        try{
            const response = await axios.get(`${this.baseUrl}/live`);
            const responseData: LiveMatch[] = response.data;
            return responseData
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }

    //Method to get all players in a live match using one player's ID
    async get_players(account_id: number): Promise<Player[]> {
        try{
            //get all live matches
            const matches: LiveMatch[] = await this.get_live_matches();
            //find the match that contains the player with the given ID
            //use find method to return the first match that contains the player with the given ID
            const match = matches.find(match => match.players.find(player => player.account_id === account_id && match.deactivate_time === 0));
            //if match is found, return all players in that match
            if(match){
                return match.players;
            }
            else{
                throw new Error('No match found');
            }

        }
        catch(error){
            console.log(error);
            throw error;
        }
    }

}