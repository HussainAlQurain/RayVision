"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Steam = require('steam');
const Dota2 = require('dota2');
dotenv_1.default.config();
class Dota {
    constructor() {
        this.steamClient = new Steam.SteamClient();
        this.steamUser = new Steam.SteamUser(this.steamClient);
        this.dotaClient = new Dota2.Dota2Client(this.steamClient, true);
    }
    //connect to steam client
    connect() {
        try {
            if (!this.steamClient.loggedOn) {
                this.steamClient.connect();
                this.steamClient.on('connected', () => {
                    this.steamUser.logOn({
                        account_name: process.env.DOTA_ACCOUNT,
                        password: process.env.DOTA_PASSWORD
                    });
                });
            }
            else {
                console.log('Already logged in');
            }
        }
        catch (error) {
            return error;
        }
    }
    //disconnect from steam client
    disconnect() {
        try {
            if (this.steamClient.loggedOn) {
                this.steamClient.disconnect();
            }
            else {
                console.log('Already logged out');
            }
        }
        catch (error) {
            return error;
        }
    }
    //connect to dota client
    dotaConnect() {
        try {
            if (this.steamClient.loggedOn) {
                this.dotaClient.launch();
                this.dotaClient.on('ready', () => {
                    console.log('Dota2 ready');
                });
            }
            else {
                console.log('Not logged in to steam client');
            }
        }
        catch (error) {
            return error;
        }
    }
    //disconnect from dota client
    dotaDisconnect() {
        try {
            this.dotaClient.exit();
        }
        catch (error) {
            return error;
        }
    }
    //request player profile data
    getPlayerProfile(steamId) {
        try {
            this.dotaClient.requestProfileCard(steamId, (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(data);
                    return (data);
                }
            });
        }
        catch (error) {
            return error;
        }
    }
}
exports.default = Dota;
