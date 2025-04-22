"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = parseOptions;
/* eslint-disable  @typescript-eslint/no-explicit-any */
function parseOptions(options) {
    return options
        ? new URLSearchParams(Object.entries(options).filter(([, v]) => v) // remove undefined
        ).toString()
        : '';
}
//# sourceMappingURL=parseOptions.js.map