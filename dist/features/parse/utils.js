"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaDataParse = exports.getTwitterContext = exports.getYoutubeContext = exports.getMediumContext = exports.parseUrl = exports.extraMedia = void 0;
var url_parse_1 = __importDefault(require("url-parse"));
var R = __importStar(require("ramda"));
var getPageFromUrl_1 = require("../../crawler/getPageFromUrl");
var type_1 = require("../../type");
var getEle = function (selector) { return (document.querySelectorAll(selector)); };
var getEleText = function (selector) { return getEle(selector)[0].innerText || ''; };
var getEleImgSrc = function (selector) { return getEle(selector)[0].src || ''; };
var extraMedia = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var validateUrl, page, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validateUrl = (0, exports.parseUrl)(url);
                if (!validateUrl)
                    return [2 /*return*/];
                return [4 /*yield*/, (0, getPageFromUrl_1.getPageFromUrl)(validateUrl.url)];
            case 1:
                page = _a.sent();
                console.log(validateUrl);
                return [2 /*return*/, exports.getMediaDataParse[validateUrl.type](page)];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                throw e_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.extraMedia = extraMedia;
var parseUrl = function (url) {
    if (!url)
        return;
    try {
        var _a = (0, url_parse_1.default)(url), host_1 = _a.host, href = _a.href;
        var mediaTypeArr = Object.keys(type_1.MediaType).map(function (key) { return type_1.MediaType[key]; });
        var mediaType = mediaTypeArr.find(function (item) { return new RegExp("".concat(item, "$")).test(host_1); });
        if (!mediaType) {
            throw '目前只支持 twitter/medium/youtube 三个平台';
        }
        return {
            url: href,
            type: mediaType
        };
    }
    catch (e) {
        throw "".concat(e);
    }
};
exports.parseUrl = parseUrl;
var getMediumContext = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var titleSel, paragraphImageSel, previewSel, callback, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                titleSel = '.pw-post-title';
                paragraphImageSel = '.paragraph-image img';
                previewSel = '.pw-post-body-paragraph';
                callback = function () { return ((function (titleSel, paragraphImageSel) {
                    var title = getEleText(titleSel);
                    var img = getEleImgSrc(paragraphImageSel);
                    var preview = Array.from(getEle(previewSel)).slice(0, 2).map(function (node) { return node.innerText; }).join('\n');
                    return {
                        title: title,
                        img: img,
                        preview: preview
                    };
                })(titleSel, paragraphImageSel)); };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, page.evaluate(callback)];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                e_2 = _a.sent();
                console.error('getMediumContext error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMediumContext = getMediumContext;
var getYoutubeContext = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var titleSel, previewSel, callback, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                titleSel = '#container > h1';
                previewSel = '#description > yt-formatted-string > span:nth-child(1)';
                callback = function () { return ((function (titleSel, previewSel) {
                    var title = document.querySelector(titleSel).innerText || '';
                    // const img = getEleImgSrc(paragraphImageSel);
                    var preview = document.querySelector(previewSel).innerText || '';
                    return {
                        title: title,
                        preview: preview
                    };
                })(titleSel, previewSel)); };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, page.evaluate(callback)];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                e_3 = _a.sent();
                console.error(e_3);
                throw 'getYoutubeContext error';
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getYoutubeContext = getYoutubeContext;
var twitterResultPath = [
    'threaded_conversation_with_injections',
    'instructions',
    0,
    'entries',
    0,
    'content',
    'itemContent',
    'tweet_results',
    'result',
    'legacy'
];
var twitterLegacyProperties = [
    'full_text',
    'favorite_count',
    'quote_count',
    'reply_count',
    'retweet_count'
];
var convertTwitterLegacyPropertiesToMediaData = function (obj) {
    return {
        title: obj.full_text,
        img: '',
        preview: '',
        twitter_avatar: '',
        twitter_name: '',
        likes: Number(obj.favorite_count),
        retweets: Number(obj.retweet_count),
        quote_tweets: Number(obj.quote_count),
        twitter_handle: ''
    };
};
var getTwitterContext = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var getResponseBody, result_1, getTwitterPropPath_1, obj_1, formattedObj, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, page.setRequestInterception(true)];
            case 1:
                _a.sent();
                console.log('getTwitterContext');
                return [4 /*yield*/, page.on('request', function (req) {
                        return req.continue();
                    })];
            case 2:
                _a.sent();
                getResponseBody = function () { return new Promise(function (resolve) {
                    page.on(('response'), function (res) { return __awaiter(void 0, void 0, void 0, function () {
                        var data, e_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!(res.url().includes('/i/api/graphql/') && res.url().includes('TweetDetail'))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, res.json()];
                                case 1:
                                    data = _a.sent();
                                    resolve(data);
                                    _a.label = 2;
                                case 2: return [3 /*break*/, 4];
                                case 3:
                                    e_5 = _a.sent();
                                    console.error('get twitter response body error', e_5);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                }); };
                return [4 /*yield*/, getResponseBody()];
            case 3:
                result_1 = _a.sent();
                if (!result_1)
                    return [2 /*return*/];
                getTwitterPropPath_1 = function (prop) { return R.path(__spreadArray(__spreadArray([], twitterResultPath, true), [prop], false)); };
                obj_1 = {};
                twitterLegacyProperties.forEach(function (prop) {
                    var _a;
                    obj_1[prop] = getTwitterPropPath_1(prop)((_a = result_1.data) !== null && _a !== void 0 ? _a : {});
                });
                formattedObj = convertTwitterLegacyPropertiesToMediaData(obj_1);
                console.log(formattedObj);
                return [2 /*return*/, Promise.resolve(formattedObj)];
            case 4:
                e_4 = _a.sent();
                console.error('getTwitterContext error', e_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getTwitterContext = getTwitterContext;
exports.getMediaDataParse = (_a = {},
    _a[type_1.MediaType.Medium] = exports.getMediumContext,
    _a[type_1.MediaType.Twitter] = exports.getTwitterContext,
    _a[type_1.MediaType.Youtube] = exports.getYoutubeContext,
    _a);
