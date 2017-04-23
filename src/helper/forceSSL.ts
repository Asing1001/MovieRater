const herokuSSLHeader = 'x-forwarded-proto';
export default function (environments: string[] = ['production'], status = 301) {
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
};