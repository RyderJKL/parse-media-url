"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var path_1 = __importDefault(require("path"));
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf, colorize = winston_1.format.colorize;
var myFormat = printf(function (info) {
    return "".concat(info.timestamp, " ").concat(info.level, ": ").concat(info.message);
});
var logger = (0, winston_1.createLogger)({
    format: combine(colorize(), timestamp(), myFormat),
    levels: winston_1.config.syslog.levels,
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/error.log'), level: 'error' }),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/db.log'), level: 'db' }),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/warn.log'), level: 'warn' }),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/info.log'), level: 'info' }),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/http.log'), level: 'http' }),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/verbose.log'), level: 'verbose' }),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/debug.log'), level: 'debug' }),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/silly.log'), level: 'silly' }),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/access.log'), level: 'access' }),
        new winston_1.transports.File({ filename: path_1.default.resolve(process.cwd(), './logs/combined.log') })
    ]
});
if (process.env.NODE_ENV !== '') {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.simple()
    }));
}
exports.default = logger;
