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

        const searchOptions = new Dota2.CMsgDOTARequestMatches({ 
            search_key: accountId,
            game_modes: [Dota2.EMatchGroup.MatchGroupNormal],
            lobby_type: Dota2.ELobbyType.LobbyTypeInvalid,
            request_id: 1
        });

        this.dotaClient.Lobby.search(searchOptions, (err: any, response: any) => {
            if (err) {
                console.error('Error searching for live game:', err);
                return;
            }

            const matches = response.matches as LiveMatch[];

            if (matches.length === 0) {
                console.log('No live games found for the specified account ID.');
            } else {
                console.log('Live games found for the specified account ID:');
                matches.forEach((match: LiveMatch) => {
                    console.log('Match ID:', match.match_id);
                });
            }
        });
    }


}