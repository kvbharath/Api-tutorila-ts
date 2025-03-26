import { Express, Request, Response } from "express";
import { createUserHandler } from "./controller/user.controller";
import validateRequest from "./middleware/validateRequest";
import requiresUser from "./middleware/requiresUser";
import { createUserSchema, createUserSessionSchema } from "./schemas/user.schema";
import { createUsersessionHandler, getUserSessionsHandler, invalidateUserSessionHandler } from "./controller/session.controller";

export default function (app: Express) {
    app.get("/healthcheck", (req: Request, res: Response) => {
        res.sendStatus(200);
    });
// Register user
//POST /api/user

app.post("/api/users",validateRequest.validate(createUserSchema),createUserHandler)


// Login
//POST /api/session

app.post("/api/sessions",validateRequest.validate(createUserSessionSchema),createUsersessionHandler)


//Get the user's session
//GET /api/session
app.get("/api/sessions",requiresUser,getUserSessionsHandler)

//Logout
// DELETE /api/session

app.delete("/api/sessions",requiresUser,invalidateUserSessionHandler);

// Create post

// app.post("/api/posts",[requiresUser,validateRequest(createPostSchema)],createPostHandler);
}