"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
var koa_1 = __importDefault(require("koa"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var router_1 = __importDefault(require("./router"));
var server = function (_a) {
    var preTap = _a.preTap, postTap = _a.postTap, catchTap = _a.catchTap;
    var handleError = function (error) { return (0, rxjs_1.of)((0, operators_1.catchError)(error)); };
    var listen = function () {
        var _a;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        (_a = new koa_1.default()
            .use((0, koa_bodyparser_1.default)({
            extendTypes: {
                json: ['application/json'] //
            },
            onerror: function (err, ctx) {
                ctx.throw('body parse error', 422);
            }
        }))
            .use(router_1.default.routes())
            .use(router_1.default.allowedMethods())
            .use(function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var root$, done$, subscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        root$ = new rxjs_1.Subject();
                        done$ = new rxjs_1.Subject();
                        subscription = root$
                            .pipe((0, operators_1.tap)(preTap), (0, operators_1.single)(), (0, operators_1.tap)(postTap), (0, operators_1.catchError)(handleError), (0, operators_1.tap)(function () { return done$.complete(); }))
                            .subscribe();
                        root$.next(ctx);
                        root$.complete();
                        return [4 /*yield*/, (0, rxjs_1.from)(done$)];
                    case 1:
                        _a.sent();
                        subscription.unsubscribe();
                        next();
                        return [2 /*return*/];
                }
            });
        }); })).listen.apply(_a, params);
    };
    return {
        listen: listen
    };
};
exports.server = server;
