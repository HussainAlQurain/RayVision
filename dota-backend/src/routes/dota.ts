import { Router } from "express";
import { DotaHandler } from "../handlers/dota";

const DotaRouter = Router();

const dotaHandler = new DotaHandler();

DotaRouter.get('/live', dotaHandler.matches);
DotaRouter.get('/player/:id', dotaHandler.search);

export default DotaRouter;