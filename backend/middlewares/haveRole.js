const httpStatus = require('http-status');

module.exports = (...roles) => {
    return (req,res,next) => {

        let a = false;

        if(req.roles) {
            for(let i = 0;i < roles.length;i++) {
                if(req.roles.indexOf(roles[i]) !== -1) {
                    a = true;
                    break;
                }
            }
        }

        if(!a) {
            const error = new Error("vous n'êtes pas autorisé à faire cette opération");
            error.status = httpStatus.FORBIDDEN;
            return next(error);
        }
        next();
    }
};