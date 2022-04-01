"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var router_1 = __importDefault(require("@koa/router"));
var parse_1 = require("./features/parse");
exports.router = new router_1.default();
exports.router.post('/parse', parse_1.parseController.parse);
exports.default = exports.router;
