import express from "express";

const routes = express.Router();

routes.get('/', (req: express.Request, res: express.Response): void => {
    res.status(200).send('Welcome to my Store');
});

export default routes;