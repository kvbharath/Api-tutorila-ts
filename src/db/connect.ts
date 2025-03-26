import mongoose from "mongoose";
import config from "config";
import log from "../logger/index";

function connect(){
    const dbUri = config.get("dbUri") as string;
    return mongoose.connect(dbUri)
    .then(() => log.info("Connected to MongoDB"))
    .catch((err) => log.error("Failed to connect to MongoDB", err));
}

export default connect;