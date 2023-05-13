import dotenv from 'dotenv';

const Steam = require('steam');
const Dota2 = require('dota2');

dotenv.config();

export default class Dota {
    private steamClient;
    private steamUser;
    private dotaClient;


    constructor() {
        this.steamClient = new Steam.SteamClient();
        this.steamUser = new Steam.SteamUser(this.steamClient);
        this.dotaClient = new Dota2.Dota2Client(this.steamClient, true);
    }
    //connect to steam client
    public connect() {
        try{
            if(!this.steamClient.loggedOn) {
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
        } catch (error) {
            return error;
        }
    }

    //disconnect from steam client
    public disconnect() {
        try{
            if(this.steamClient.loggedOn){
                this.steamClient.disconnect();
            }
            else{
                console.log('Already logged out');
            }
        }
        catch(error) {
            return error;
        }
    }
    //connect to dota client
    public dotaConnect() {
        try{
            if(this.steamClient.loggedOn) {
                this.dotaClient.launch();
                this.dotaClient.on('ready', () => {
                    console.log('Dota2 ready');
                });
            }
            else {
                console.log('Not logged in to steam client');
            }
        }
        catch(error) {
            return error;
        }
    }
        
    //disconnect from dota client
    public dotaDisconnect() {
        try{
            this.dotaClient.exit();
        }
        catch(error) {
            return error;
        }       
    }

    //request player profile data
    public getPlayerProfile(steamId: string) {
        try{
            this.dotaClient.requestProfileCard(steamId, (err, data) => {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(data);
                    return(data);
                }
            });
        }
        catch(error) {
            return error;
        }
    }
    
}