import { Router } from "express";

const DotaRouter = Router();

DotaRouter.get('/:id', DotaHandler.show);

export default DotaRouter;