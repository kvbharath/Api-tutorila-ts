import jwt from "jsonwebtoken";
import config from "config";

export function sign(object: Object, options?: jwt.SignOptions) {
  const privateKey = config.get<string>("privateKey").replace(/\\n/g, "\n"); // Ensure line breaks are correct
  return jwt.sign(object, privateKey, { ...(options || {}), algorithm: "RS256" });
}


export function decode(token: string) {
    try {
        const decoded = jwt.verify(token, config.get<string>("privateKey").replace(/\\n/g, "\n"));
        return { valid: true, expired: false, decoded };
    } catch (error) {
        console.error("JWT Decode Error:", error);

        return {
            valid: false,
            expired: error instanceof Error && error.message === "jwt expired",
            decoded: null,
        };
    }
}