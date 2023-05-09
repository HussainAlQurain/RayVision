import express from "express";
import DotaRouter from "./dota";
const routes = express.Router();

routes.get('/', (req: express.Request, res: express.Response): void => {
    res.status(200).send('Welcome to my dota api');
});

routes.use('/dota', DotaRouter);

export default routes;