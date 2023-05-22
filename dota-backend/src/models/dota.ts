import dotenv from 'dotenv';
import axios from 'axios';
import { LiveMatch } from '../types/LiveMatches';
import { Player } from '../types/Player';

const Steam = require('steam');
const Dota2 = require('dota2');

dotenv.config();

export default class Dota {

    private steamClient: any;
    private steamUser: any;
    private dotaClient: any;

    private steam_acc = process.env.STEAM_ACCOUNT;
    private steam_pass = process.env.STEAM_PASSWORD;

    constructor() {
        this.loginToSteam();
    }
    
    async loginToSteam() {
        this.steamClient = new Steam.SteamClient();
        this.steamUser = new Steam.SteamUser(this.steamClient);
        this.steamClient.on('connected', () => {
            this.steamUser.logOn({
                account_name: this.steam_acc,
                password: this.steam_pass
            });
        });
        this.steamClient.on('logOnResponse', (logonResp: any) => {
            if (logonResp.eresult === Steam.EResult.OK) {
                console.log('Logged in!');
                this.steamUser.gamesPlayed({ games_played: [{ game_id: 570 }] });
            } else {
                console.log(logonResp);
            }
        });
    }

    async getGames() {
        this.dotaClient = new Dota2.Dota2Client(this.steamClient, true);
        this.dotaClient.on('ready', () => {
            //launch dota
            this.dotaClient.launch();
            //get live matches
            this.dotaClient.on('liveGamesUpdate', (liveGames: any) => {
                console.log(liveGames);
                return liveGames;
            });
        });
    }

}