const httpStatus = require('http-status');

module.exports = (role) => {
    return (req,res,next) => {
        if(!req.roles || req.roles.indexof(role) === -1) {
            const error = new Error("vous n'êtes pas autorisé à faire cette opération");
            error.status = httpStatus.FORBIDDEN;
            return next(error);
        }
        next();
    }
};