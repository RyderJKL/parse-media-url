"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var config_1 = __importDefault(require("../config"));
//@ts-ignore
var connection = mysql_1.default.createConnection(config_1.default.db);
connection.connect(function (error) {
    if (error) {
        console.error("connect faild:".concat(error.stack));
        return;
    }
    console.log("connected id: ".concat(connection.threadId));
});
exports.default = connection;
