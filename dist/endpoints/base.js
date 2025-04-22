"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEndpoint = void 0;
const api_1 = require("../api");
class BaseEndpoint {
    accessToken;
    api;
    constructor(accessToken, baseURL) {
        this.accessToken = accessToken;
        this.api = new api_1.Api(accessToken, baseURL);
    }
}
exports.BaseEndpoint = BaseEndpoint;
//# sourceMappingURL=base.js.map