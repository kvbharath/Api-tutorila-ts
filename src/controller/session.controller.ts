import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createAccessToken, createSession,findSessions,updateSession } from "../service/session.service";
import  config  from "config";
import { sign } from "../utils/jwt.utils";
import { get } from "lodash";

export async function createUsersessionHandler(req: Request, res: Response){
    const user = await validatePassword(req.body);

    if(!user){
        return res.status(401).send("Invalid username or password");
    }

    const userId: string = String(user._id); // Fix for 'unknown' _id issue
    const userAgent: string = String(req.get("user-agent")) || "unknown";

    const session = await createSession(userId, userAgent);

 
    const accessToken = createAccessToken({
        user,session
    });

    const refreshToken = sign(session,{expiresIn: config.get("refreshTokenTtl")});

    return res.send({accessToken,refreshToken})

}

export async function invalidateUserSessionHandler(req: Request, res: Response){
    // Implement logic to invalidate the user's session
    const sessionId = get(req,"user.session");

    await updateSession({_id:sessionId},{valid:false});
    return res.sendStatus(200);

}


export async function getUserSessionsHandler(req: Request, res: Response) {
    const userId = get (req, "user._id");
    const sessions = await findSessions( { user: userId, valid: true });
    return res.send(sessions);
    }
