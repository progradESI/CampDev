const Compte = require('../models/compte');
const MemebreDeProjet = require('../models/membreDeProjet');
const httpStatus = require('http-status');
const Utilisateur = require('../models/utilisateur');
const Role = require('../models/role');
const bcrypt = require('bcrypt');

const db = {};

db.getUserById = async (req,res,next) => {
    try {

        if((!req.roles || req.roles.indexOf('ADMIN')===-1) && req.id != req.params.id) {
            const error = new Error('permission refusée');
            error.status = httpStatus.FORBIDDEN;
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


db.changeUserPassword = async (req,res,next) => {
    try {

        const { id } = req.params;

        if(id !== req.id) {
            const error = new Error('permission refusée');
            error.status = httpStatus.FORBIDDEN;
            return next(error);
        }

        const { oldPassword,newPassword } = req.body;

        const compte = await Compte.findByPk(id);

        if(!compte) {
            const error = new Error('compte non trouvée');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        if(!await bcrypt.compare(oldPassword, compte.get('motDePasse'))) {
            const error = new Error('mot de passe incorect');
            error.status = httpStatus.FORBIDDEN;
            return next(error);
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        const userData = {...compte.dataValues,['motDePasse']:encryptedPassword}

        await Compte.update(userData, {
            where: {
                idCompte: id
            }
        });

        res.status(httpStatus.OK).json({
            message: 'mot de passe a été modifié'
        });

    } catch(err) {
        next(err);
    }
}

db.changeUserEmail = async (req,res,next) => {
    try {

        const { id } = req.params;

        if(id !== req.id) {
            const error = new Error('permission refusée');
            error.status = httpStatus.FORBIDDEN;
            return next(error);
        }

        const { password,email } = req.body;

        const compte = await Compte.findByPk(id);

        if(!compte) {
            const error = new Error('compte non trouvée');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        if(!await bcrypt.compare(password, compte.get('motDePasse'))) {
            const error = new Error('mot de passe incorect');
            error.status = httpStatus.FORBIDDEN;
            return next(error);
        }

        const userData = {...compte.dataValues,['email']:email};

        await Compte.update(userData, {
            where: {
                idCompte: id
            }
        });

        res.status(httpStatus.OK).json({
            message: 'email a été modifié'
        });

    } catch(err) {
        next(err);
    }
}


db.changeUserInfo = async (req,res,next) => {
    try {

        const { id } = req.params;
        const { numeroTelephone } = req.body;

        const compte = await Compte.findByPk(id);

        if(!compte) {
            const error = new Error('compte non trouvée');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        const userData = compte.dataValues;

        if(numeroTelephone) {
            userData.numeroTelephone = numeroTelephone;
        }

        if(req.file) {
            //const oldPic = userData.photo;
            userData = '/pictures/'+req.file.filename;
        }

        res.status(httpStatus.OK).json({
            message: 'les informations ont été mises à jour avec succès'
        });

    } catch(err) {
        next(err);
    }
}


module.exports = db;