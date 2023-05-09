import { Response, Request } from "express";

export class DotaHandler {
    
    async show(req: Request, res: Response) {
        try{
            res.status(200).json({message: "DotaHandler.show"});
        }
        catch (error) {
            res.status(500).json(error);
        }
    }

}