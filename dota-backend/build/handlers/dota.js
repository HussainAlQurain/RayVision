"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotaHandler = void 0;
const dota_1 = __importDefault(require("../models/dota"));
const dota = new dota_1.default();
class DotaHandler {
    async show(req, res) {
        try {
            dota.connect();
            dota.dotaConnect();
            const data = dota.getPlayerProfile(req.params.id);
            dota.dotaDisconnect();
            dota.disconnect();
            res.status(200).json({ message: `${data}` });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
}
exports.DotaHandler = DotaHandler;
