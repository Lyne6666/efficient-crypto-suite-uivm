// src/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [new transports.Console()]
});

function enableDebug() {
    logger.level = 'debug';
}

module.exports = logger;
