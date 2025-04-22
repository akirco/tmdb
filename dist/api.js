"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const constants_1 = require("./common/constants");
const utils_1 = require("./utils");
class Api {
    accessToken;
    baseURL;
    constructor(accessToken, baseURL) {
        this.accessToken = accessToken;
        this.accessToken = accessToken;
        this.baseURL = baseURL || constants_1.BASE_URL_V3;
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    async get(path, options) {
        const params = (0, utils_1.parseOptions)(options);
        const response = await (0, cross_fetch_1.default)(`${this.baseURL}${path}?${params}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json;charset=utf-8',
            },
        });
        if (!response.ok) {
            return Promise.reject((await response.json()));
        }
        return (await response.json());
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map