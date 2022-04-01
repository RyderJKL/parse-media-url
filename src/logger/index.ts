import { createLogger, format, transports, config } from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize } = format

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})

const logger = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    myFormat
  ),
  levels: config.syslog.levels,
  transports: [
    new transports.Console(),
    new transports.File({filename: path.resolve(process.cwd(), './logs/error.log'), level: 'error'}),
    new transports.File({filename: path.resolve(process.cwd(), './logs/db.log'), level: 'db'}),
    new transports.File({filename: path.resolve(process.cwd(), './logs/warn.log'), level: 'warn'}),
    new transports.File({filename: path.resolve(process.cwd(), './logs/info.log'), level: 'info'}),
    new transports.File({filename: path.resolve(process.cwd(), './logs/http.log'), level: 'http'}),
    new transports.File({filename: path.resolve(process.cwd(), './logs/verbose.log'), level: 'verbose'}),
    new transports.File({filename: path.resolve(process.cwd(), './logs/debug.log'), level: 'debug'}),
    new transports.File({filename: path.resolve(process.cwd(), './logs/silly.log'), level: 'silly'}),
    new transports.File({filename: path.resolve(process.cwd(), './logs/access.log'), level: 'access'}),
    new transports.File({filename: path.resolve(process.cwd(), './logs/combined.log')})
  ]
})

if (process.env.NODE_ENV !== '') {
  logger.add(new transports.Console({
    format: format.simple()
  }))
}

export default logger
