"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var configPath = path_1.default.resolve(process.cwd(), ".env.".concat(process.env.NODE_ENV));
dotenv_1.default.config({ path: configPath });
var server_1 = require("./server");
(0, server_1.server)({
    preTap: function (_a) {
        var request = _a.request;
        return console.log(request);
    },
    postTap: function (_a) {
        var response = _a.response;
        return console.log(response);
    },
    catchTap: function (error) { return console.error(error); },
}).listen(3000);
