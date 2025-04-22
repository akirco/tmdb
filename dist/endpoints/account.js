"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountEndpoint = void 0;
const base_1 = require("./base");
class AccountEndpoint extends base_1.BaseEndpoint {
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
    }
    async details() {
        return await this.api.get('/account');
    }
}
exports.AccountEndpoint = AccountEndpoint;
//# sourceMappingURL=account.js.map