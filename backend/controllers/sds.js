const httpStatus = require("http-status");
const Projet = require("../models/projet");
const MembreDeProjet = require("../models/membreDeProjet");
const Compte = require("../models/compte");
const Utilisateur = require("../models/utilisateur");
const { projetFilter } = require("../utils/sequelizeUtils");



const db = {};


db.getAllProjects = async (req,res,next) => {
    try {

        const { where,ordering } = projetFilter(req.query);

        const projets = await Projet.findAll({
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
            where:where,
            order: ordering,
            limit: parseInt(req.query.limit || '10'),
            offset: parseInt(req.query.offset || '0')
        });

        res.status(httpStatus.OK).json({
            length:projets.length,
            projets
        });

    } catch(err) {
        next(err);
    }
}


module.exports = db;