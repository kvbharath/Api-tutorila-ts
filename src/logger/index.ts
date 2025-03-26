import logger from 'pino';
import dayjs from 'dayjs';

const log = logger({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true, // Enables colored output
            levelFirst: true, // Displays the log level first
            translateTime: true, // Translates time to a human-readable format
            ignore: 'pid,hostname', // Removes 'pid' and 'hostname' from the output
        },
    },
    base: null, // Removes default fields like pid
    timestamp: () => `"time":"${dayjs().format()}"`
});

export default log;