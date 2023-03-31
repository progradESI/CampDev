const httpStatus = require("http-status");
const Projet = require("../models/projet");
const MembreDeProjet = require("../models/membreDeProjet");
const Compte = require("../models/compte");
const Utilisateur = require("../models/utilisateur");
const ProjetParams = require('../models/projetParams');
const { projetFilter } = require("../utils/sequelizeUtils");



const db = {};

db.getAllProjects = async (req,res,next) => {
    try {

        const utilisateur = await Utilisateur.findOne({
            where: {
                idCompte:14
            }
        });

        if(!utilisateur) {
            const error = new Error('utilisateur non trouvée');
            error.status = httpStatus.OK;
            return next(error);
        }

        const { where,ordering } = projetFilter(req.query);

        console.log(where);

        

        const projets = await utilisateur.getProjetsEncadrées({
            include: [
                {
                    model:MembreDeProjet,
                    as:'membre',
                    include: [
                        {
                            model:Compte,
                            as:'compte',
                            attributes: {
                                exclude: ['motDePasse']
                            }
                        },
                    ],
                    attributes: {
                        exclude:['idProjet','idCompte','id']
                    }
                },
                {
                    model: Utilisateur,
                    as:'encadreurs',
                    through: {
                        attributes:['type']
                    }
                }
            ],
            where: where,
            order: ordering,
            limit: parseInt(req.query.limit || '10'),
            offset: parseInt(req.query.offset || '0')
        });

        res.status(httpStatus.OK).json({
            length: projets.length,
            projets
        });

    } catch(err) {
        next(err);
    }
}

module.exports = db;