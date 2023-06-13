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
      try{

      
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
      } catch (err) {
        console.log(err);
      }
    }

    async launch_dota() {
      try{
        this.dotaClient = new Dota2.Dota2Client(this.steamClient, true, true);
        this.dotaClient.launch();
      } catch (err){
        console.log(err);
      }
    }
    
    async searchLiveGameByAccountId() {
      try{

      
        return new Promise((resolve, reject) => {
          const filterOptions = {
            start_game: 90,
          };
      
          const handleSourceTVGamesResponse = (sourceTVGamesResponse: any) => {
            resolve(sourceTVGamesResponse);
          };
      
          this.dotaClient.on('sourceTVGamesData', handleSourceTVGamesResponse);
      
          this.dotaClient.requestSourceTVGames(filterOptions, (err: any, response: any) => {
            if (err) {
              console.error(err);
              reject(err);
              return;
            }
            
          });
        });}
        catch (err) {
          console.log(err);
        }
      }

      async getMatch(accountId: string) {
        try {
          if (!this.dotaClient || !this.steamClient) {
            await this.steam_connect();
          }
          this.steamRichPresence.request(accountId);
          const data = await new Promise((resolve) => {
            this.steamRichPresence.once('info', (info: any) => {
              const stringData = info.rich_presence[0].rich_presence_kv;
              console.log(stringData);
              if (stringData) {
                const buffer = Buffer.from(stringData, 'base64');
                const decodedString = buffer.toString('utf8');
                const match = decodedString.match(/WatchableGameID\x00([^#]+)(.*)/);
                const gameId = match ? match[1] : null;
                const match2 = gameId?.match(/^\d+/);
                const extractedNumbers = match2 ? match2[0] : null;
      
                const lobbies: (string | null)[] = [];
                lobbies.push(extractedNumbers);
      
                const handler = (sourceTVGamesResponse: any) => {
                  resolve(sourceTVGamesResponse);
                };
      
                this.dotaClient.on('sourceTVGamesData', handler);
                this.dotaClient.requestSourceTVGames({ lobby_ids: lobbies, start_game: 0 });
              }
            });
          });
      
          return data;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }

}