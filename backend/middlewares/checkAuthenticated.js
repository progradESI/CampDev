const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const Compte = require('../models/compte');
const { JsonWebTokenError,TokenExpiredError } = require('jsonwebtoken');

module.exports = async (req,res,next) => {
    try {

        const header = req.get('Authorization');

        if(!header) {
            const error = new Error('utilisateur non authentifié');
            error.status = httpStatus.UNAUTHORIZED;
            return next(error);
        }

        const token = header.split(' ')[1];

        const { id } = jwt.verify(token,process.env.JWT_SECRET);

        const compte = await Compte.findByPk(id);

        req.id = id;
        req.roles = await compte.getRoles({
            joinTableAttributes: [],
            attributes: ['intitule'],
            raw:true
        });
        req.roles = req.roles.map(role => role.intitule);

        next();

    } catch(err) {
        if(err instanceof TokenExpiredError) {
            const error = new Error('le jeton a expiré');
            error.status = httpStatus.UNAUTHORIZED;
            return next(error);
        } else if(err instanceof JsonWebTokenError) {
            const error = new Error('jeton invalide');
            error.status = httpStatus.UNAUTHORIZED;
            return next(error);
        }
        next(err);
    }
}