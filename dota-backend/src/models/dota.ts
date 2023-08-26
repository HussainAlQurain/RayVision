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
    private heroData: any[] = [];
    private steamIdConverter = BigInt("76561197960265728");

    constructor() {
    }

    isValidSteamID64(id: string) {
        // Ensure it's a string and a numeric one.
        if (typeof id !== 'string' || !/^\d+$/.test(id)) {
          return false;
        }
      
        // Ensure it's 17 digits and starts with 7656.
        // This is a basic check, and it's possible that not all IDs in this range are valid, 
        // but it can be a good start.
        return id.length === 17 && id.startsWith('7656');
      }

    private async connectWithRetry() {
        try {
            const MAX_RETRIES = 3; // Maximum number of retry attempts
            let retries = 0;
    
            while (retries < MAX_RETRIES) {
                try {
                    console.log(`Connecting to Steam... Attempt ${retries + 1}`);
                    await this.steam_connect();
                    console.log('Connected to Steam successfully!');
                    await this.launch_dota(); // Await the launch_dota function
                    return;
                } catch (err: any) {
                    console.log(`Error connecting to Steam: ${err.message}`);
                    retries++;
                    await this.wait(30000); // Wait for 30 seconds before retrying
                }
            }
    
            console.log('Failed to connect to Steam after multiple attempts.');
        } catch (err: any) {
            console.log('Unexpected error occurred while connecting to Steam:', err);
        }
    }
    

    private wait(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async steam_connect() {
        try {
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
        try {
          return new Promise<void>((resolve, reject) => {
            this.dotaClient = new Dota2.Dota2Client(this.steamClient, true, true);
            this.dotaClient.on('ready', () => {
              console.log('Dota 2 Game Coordinator is ready!');
              resolve(); // Resolve the Promise when the 'ready' event is emitted
            });
            this.dotaClient.on('unready', () => {
              console.log('Dota 2 Game Coordinator is no longer ready!');
              reject(new Error('Dota 2 Game Coordinator is no longer ready!'));
            });
            this.dotaClient.launch();
          });
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
      

    async searchLiveGameByAccountId() {
        try {
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
            });
        } catch (err) {
            console.log(err);
        }
    }

    async getMatch(accountId: string) {
        try {

            //before continuing i should try to check if the accountid is steamid32 and try to convert it to steamid64 using library such as big
            //check if the steamid is a valid steamid64 then proceed.
            const currentId = BigInt(accountId);
            let newId;
            if(Number(accountId) < 7656119796026){
                newId = currentId + this.steamIdConverter;
                newId = newId.toString();
            }
            else {
                newId = currentId;
                newId = newId.toString();
            }
            console.log(newId);

            if(!this.isValidSteamID64(newId.toString())){
                return "Invalid steam id"
            }

            if (!this.dotaClient || !this.steamClient) {
                await this.steam_connect();
            }

            this.steamRichPresence.request(newId);
            const data = await new Promise((resolve) => {
                this.steamRichPresence.once('info', (info: any) => {
                    if (info.rich_presence[0]) {
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
                    }
                });
            });
            // console.log(data)
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async processPlayerMatches(accountId: string) {
        try {
            const response = await axios.get(`https://api.opendota.com/api/players/${accountId}/matches`);
            const matches = response.data;
            const totalMatches = matches.length;
            let totalWins = 0;
            const heroesCount: { [heroId: string]: number } = {};

            matches.forEach((match: any) => {
                if (match.radiant_win && match.player_slot <= 127) {
                    totalWins++;
                } else if (!match.radiant_win && match.player_slot > 127) {
                    totalWins++;
                }

                const heroId = match.hero_id.toString();
                if (heroesCount[heroId]) {
                    heroesCount[heroId]++;
                } else {
                    heroesCount[heroId] = 1;
                }
            });

            const winRate = (totalWins / totalMatches) * 100;
            const mostPickedHeroes = Object.keys(heroesCount)
                .sort((a, b) => heroesCount[b] - heroesCount[a])
                .slice(0, 5) // Get top 5 most picked heroes
                .map((heroId) => ({ hero_id: heroId, count: heroesCount[heroId] }));

            const highestWinRateHero = Object.keys(heroesCount)
                .sort((a, b) => {
                    const winRateA = (heroesCount[a] / totalMatches) * 100;
                    const winRateB: any = (heroesCount[b] / totalMatches) * 100;
                    return winRateB - winRateA;
                })
                .slice(0, 1) // Get the highest win rate hero
                .map((heroId) => ({ hero_id: heroId, win_rate: (heroesCount[heroId] / totalMatches) * 100 }));

            return {
                account_id: accountId,
                win_rate: winRate,
                most_picked_heroes: mostPickedHeroes,
                highest_win_rate_hero: highestWinRateHero[0],
            };
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getPlayerMatches(accountId: string) {
        try {
            if (!this.dotaClient || !this.steamClient) {
                await this.connectWithRetry();
            }

            const matchData: any = await this.getMatch(accountId);
            if (matchData.body && matchData.body.game_list && matchData.body.game_list.length > 0) {
                const players = matchData.body.game_list[0].players || [];
                const accountIds = players.map((player: any) => player.account_id).filter((id: any) => id !== null);

                const playerMatchPromises = accountIds.map((id: any) => this.processPlayerMatches(id));
                const playerMatches = await Promise.all(playerMatchPromises);

                return playerMatches;
            }

            return [];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getLastFiveMatches(accountId: number) {
        try {
            if (!this.dotaClient || !this.steamClient) {
                await this.connectWithRetry();
            }
    
            return new Promise((resolve, reject) => {
                const callback = (err: any, CMsgDOTAProfileResponse: any) => {
                    if (err) {
                        console.error('Error fetching profile:', err);
                        reject(err);
                    } else {
                        resolve(CMsgDOTAProfileResponse);
                    }
                };
    
                this.dotaClient.requestProfile(accountId, callback);
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getPlayerInfo(accountId: string): Promise<any> {
        try {
          const response = await axios.get(`https://api.opendota.com/api/players/${accountId}`);
          const playerData = response.data;
    
          const {
            profile: { personaname, name, avatarfull, leaderboard_rank },
            mmr_estimate: { estimate },
          } = playerData;
    
          const playerInfo: any = {};
    
          if (personaname) {
            playerInfo.personaname = personaname;
          }
    
          if (name) {
            playerInfo.name = name;
          }
    
          if (avatarfull) {
            playerInfo.avatarfull = avatarfull;
          }
    
          if (leaderboard_rank) {
            playerInfo.leaderboard_rank = leaderboard_rank;
          }
    
          if (estimate) {
            playerInfo.mmr_estimate = estimate;
          }
    
          return playerInfo;
        } catch (error) {
          console.error("Error fetching player info:", error);
          throw error;
        }
      }

      async getHeroes(): Promise<any[]> {
        if (this.heroData.length === 0) {
          try {
            const response = await axios.get("https://api.opendota.com/api/heroes");
            this.heroData = response.data;
          } catch (error) {
            console.error("Error fetching hero data:", error);
            throw error;
          }
        }
        return this.heroData;
      }

      async getHeroById(heroId: number): Promise<any | null> {
        const heroes = await this.getHeroes();
        const hero = heroes.find((hero) => hero.id === heroId);
        return hero || null;
      }
      
}
