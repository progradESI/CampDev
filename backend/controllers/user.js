const Compte = require('../models/compte');
const MemebreDeProjet = require('../models/membreDeProjet');
const httpStatus = require('http-status');
const Utilisateur = require('../models/utilisateur');
const Role = require('../models/role');

const db = {};

db.getUserById = async (req,res,next) => {
    try {

        if((!req.roles || req.roles.indexOf('ADMIN')===-1) && req.id != req.params.id) {
            const error = new Error('permission refusée');
            error.status = httpStatus.OK;
            return next(error);
        }

        const compte = await  Compte.findByPk(req.params.id, {
            include: [
                {
                    model:Utilisateur,
                    as:'utilisateur'
                },
                {
                    model:MemebreDeProjet,
                    as:'etudiant'
                },
                {
                    model:Role,
                    as:'roles',
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        if(!compte) {
            const error = new Error('compte non trouvé');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        res.status(httpStatus.OK).json(compte);

    } catch(err) {
        next(err);
    }
}


module.exports = db;