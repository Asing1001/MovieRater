"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const herokuSSLHeader = 'x-forwarded-proto';
function default_1(environments = ['production'], status = 301) {
    return function (req, res, next) {
        if (environments.indexOf(process.env.NODE_ENV) !== -1) {
            if (req.headers[herokuSSLHeader] != 'https') {
                res.redirect(status, 'https://' + req.hostname + req.originalUrl);
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    };
}
exports.default = default_1;
;
//# sourceMappingURL=forceSSL.js.map