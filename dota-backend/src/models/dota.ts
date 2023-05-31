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


    constructor() {

    }

    async steam_connect() {
        this.steamClient = new Steam.SteamClient();
        this.steamUser = new Steam.SteamUser(this.steamClient);
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


}