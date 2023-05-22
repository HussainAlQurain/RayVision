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
        this.loginToSteam().then(() => {
            this.launchDota().then(() => {
                this.getGames();
            });
        });
    }
    

    //login to steam
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
            } else {
                console.log(logonResp);
            }
        });
    }
    
    //launch dota
    async launchDota() {
        if(this.steamClient && this.steamUser){
            this.dotaClient = new Dota2.Dota2Client(this.steamClient, true);
            this.dotaClient.launch();
            this.dotaClient.on('ready', () => {
                console.log('Dota 2 ready!');
            });
        } else {
            console.log('Steam client not ready!');
        }
    }
        

    async getGames() {
        setTimeout(() => {
            console.log('Waiting for 10 seconds...');
        }, 10000);
    }

}