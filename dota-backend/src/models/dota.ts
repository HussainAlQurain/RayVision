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
        console.log('getGames');
    }
}