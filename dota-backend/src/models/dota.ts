import dotenv from 'dotenv';
import axios from 'axios';
import { LiveMatch } from '../types/LiveMatches';
import { Player } from '../types/Player';

dotenv.config();

export default class Dota {
    private baseUrl: string = process.env.DOTA_API_URL || '';


    constructor() {
    
    }

    //get live matches
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
       
}