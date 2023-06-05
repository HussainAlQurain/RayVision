import dotenv from 'dotenv';
import axios from 'axios';
import { LiveMatch } from '../types/LiveMatches';
import { Player } from '../types/Player';

const Steam = require('steam');
const Dota2 = require('dota2');
const steam_resources = require("steam-resources");

dotenv.config();

export default class Dota {

    private steamClient: any;
    private steamUser: any;
    private dotaClient: any;
    private steamFriends: any;
    private steamRichPresence: any;


    constructor() {

    }

    async steam_connect() {
        this.steamClient = new Steam.SteamClient();
        this.steamUser = new Steam.SteamUser(this.steamClient);
        this.steamRichPresence = new Steam.SteamRichPresence(this.steamClient, 570);
        this.steamFriends = new Steam.SteamFriends(this.steamClient);
        this.steamClient.connect();
        this.steamClient.on('connected', () => {
            this.steamUser.logOn({
                account_name: process.env.STEAM_ACCOUNT,
                password: process.env.STEAM_PASSWORD
            })
        })
        this.steamClient.on('logOnResponse', () => {
            console.log('steam client connected');
            this.steamFriends.setPersonaState(Steam.EPersonaState.Online);
            this.launch_dota();
            
        })
        return this.steamClient
    }

    async launch_dota() {
        this.dotaClient = new Dota2.Dota2Client(this.steamClient, true, true);
        this.dotaClient.launch();
    }
    
    async searchLiveGameByAccountId(accountId: string) {
        return new Promise((resolve, reject) => {
          const filterOptions = {
            start_game: 90,
          };
      
          const handleSourceTVGamesResponse = (sourceTVGamesResponse: any) => {
            console.log(sourceTVGamesResponse);
            resolve(sourceTVGamesResponse);
          };
      
          this.dotaClient.on('sourceTVGamesData', handleSourceTVGamesResponse);
      
          this.dotaClient.requestSourceTVGames(filterOptions, (err: any, response: any) => {
            if (err) {
              console.error(err);
              reject(err);
              return;
            }
      
            console.log(response);
            // You can choose to resolve here if you only want the initial response.
          });
        });
      }

      async getMatch(accountId: string) {
        //search for player
        const criteria = {
          account_id: accountId
        }
        
      }


}