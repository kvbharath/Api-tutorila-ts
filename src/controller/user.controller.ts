import { Request,Response } from "express";
import { createUser } from "../service/user.service";
import { omit } from "lodash";
import log from "../logger";

export async function createUserHandler(req:Request, res:Response){
    try {
        const user = await createUser(req.body);
        console.log("Request Body:", req.body);

        return res.send(omit(user.toJSON(),"password"));
    }  catch (error) {
        console.error("Error:", error);
        log.error(error);

        return res.status(409).send({ error: "An error occurred" });
    }
}

export async function createUserSessionHandler(req:Request, res:Response){
    
}