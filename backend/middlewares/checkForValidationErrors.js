const { validationResult } = require("express-validator");
const httpStatus = require("http-status");

module.exports = async (req,res,next) => {
    try {

        const errors = validationResult(req);

        if(errors.isEmpty()) return next();

        const error = errors.array().at(0);

        const err = new Error(error.msg);
        err.status = httpStatus.BAD_REQUEST;

        next(err);

    } catch(err) {
        return next(err);
    }
}