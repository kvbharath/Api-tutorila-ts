import  {Document, FilterQuery, UpdateQuery} from 'mongoose'
import config from 'config'
import {UserDocument} from "../model/user.model";
import  Session, {SessionDocument} from "../model/session.model"
import {sign,decode} from "../utils/jwt.utils";
import { get } from 'lodash';
import { findUser } from './user.service';


export async function createSession(userId: string, userAgent: string) {
    const session = await Session.create({ user: userId, userAgent: userAgent || "unknown" });
    return session.toJSON();
}

export function createAccessToken({
    user,
    session,
}: {
    user: Omit<UserDocument, "password"> | Document<Omit<UserDocument, "password">>;
    session: Omit<SessionDocument, "password"> | Document<Omit<SessionDocument, "password">>;
}) {
    // Build and return the new access token
    const accessToken = sign(
        { ...user, session: session._id },
        { expiresIn: config.get("accessTokenTtl"), algorithm: "HS256" }
    );

    return accessToken;
}

export async function reIssueAccessToken({
    refreshToken,
    }: {
    refreshToken: string;
    }) {
    // Decode the refresh token
    const { decoded } = decode (refreshToken);

    if (!decoded || !get (decoded, "_id")) return null
    // Get the session
    const session = await Session.findById(get(decoded,"_id"));
    // Make sure the session is still valid
    if (!session || !session?.valid) return null;
    const user = await findUser({ _id: session.user });
    if (!user) return null;
    const accessToken = createAccessToken({ user, session });
    return accessToken;
    };

    export async function updateSession(query:FilterQuery<SessionDocument>,update:UpdateQuery<SessionDocument>){
        return Session.updateOne(query,update)
    }

    export async function findSessions(query:FilterQuery<SessionDocument>){
        return Session.find(query).lean();
    }