import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export default class Dota {
    private baseUrl: string = process.env.DOTA_API_URL || '';


    constructor() {
    
    }

    //get live matches
    async get_live_matches() {
        try{
            const response = await axios.get(`${this.baseUrl}/live`);
            const responseData = response.data.map((obj: any) => JSON.stringify(obj));
            return responseData;
        }
        catch(error){
            console.log(error);
            return error;
        }
    }
       
}