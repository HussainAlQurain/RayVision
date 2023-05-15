import { Router } from "express";
import { DotaHandler } from "../handlers/dota";

const DotaRouter = Router();

const dotaHandler = new DotaHandler();

DotaRouter.get('/live', dotaHandler.show);
DotaRouter.get('/live/:account_id', dotaHandler.show_players)

export default DotaRouter;