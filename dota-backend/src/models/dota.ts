import dotenv from 'dotenv';
import axios from 'axios';
import { LiveMatch } from '../types/LiveMatches';
import { Player } from '../types/Player';

const Steam = require('steam');
const Dota2 = require('dota2');

dotenv.config();

export default class Dota {



    constructor() {
    
    }

    private steam_acc = process.env.STEAM_ACCOUNT;
    private steam_pass = process.env.STEAM_PASSWORD;

    async getGames() {
        const steamClient = new Steam.SteamClient();
        const dota2Client = new Dota2.Dota2Client(steamClient);

        //log in to steam
        steamClient.on('connected', () => {
            steamClient.logOn({
                accountName: this.steam_acc,
                password: this.steam_pass
            })
        })

        //log in to dota
        await new Promise<void>((resolve) => {
            steamClient.on('logOnResponse', (logonResp: { eresult: any; }) => {
                if (logonResp.eresult === Steam.ERsult.ok) {
                    dota2Client.launch();
                    dota2Client.once('ready', () => {
                        resolve();
                    })
                } else {
                    console.log('Steam logon failed. Error', logonResp.eresult);
                }
            })
        })

        //get live games
        const games = await new Promise<any[]>((resolve) => {
            const callbackSpecificGames = (data: { specific_games: boolean; game_list: any[] }) => {
              if (data.specific_games) {
                resolve(data.game_list.filter((game) => game.players && game.players.length > 0));
              }
            };
        
            dota2Client.on('sourceTVGamesData', callbackSpecificGames);
            dota2Client.requestSourceTVGames({ start_game: 90 });
          });
         
          return games.filter((game) => game.players && game.players.length > 0);
    }
}

    // private baseUrl: string = process.env.DOTA_API_URL || '';
    // private steamUrl: string = process.env.DOTA_STEAM_URL || '';
    //Method to get all live matches using OpenDota API
    // async get_live_matches(): Promise<LiveMatch[]> {
    //     try{
    //         const response = await axios.get(`${this.baseUrl}/live`);
    //         const responseData: LiveMatch[] = response.data;
    //         return responseData
    //     }
    //     catch(error){
    //         console.log(error);
    //         throw error;
    //     }
    // }

    //Method to get all players in a live match using one player's ID
    // async get_players(account_id: number): Promise<Player[]> {
    //     try{
    //         //get all live matches
    //         const matches: LiveMatch[] = await this.get_live_matches();
    //         //find the match that contains the player with the given ID
    //         //use find method to return the first match that contains the player with the given ID
    //         const match = matches.find(match => match.players.find(player => player.account_id === account_id && match.deactivate_time === 0));
    //         //if match is found, return all players in that match
    //         if(match){
    //             return match.players;
    //         }
    //         else{
    //             throw new Error('No match found');
    //         }

    //     }
    //     catch(error){
    //         console.log(error);
    //         throw error;
    //     }
    // }

