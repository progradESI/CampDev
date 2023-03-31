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

        const { where,ordering } = projetFilter(req.query);

        where['type'] = 'STARTUP';

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
            where: where,
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

db.changeProjectParams = async (req,res,next) => {
    try {

        const currentYear = new Date().getFullYear();
        const attributes = Object.keys(ProjetParams.getAttributes())
            .filter(att => att !== 'anne')
        let i = 0;

        const data = {};

        attributes.forEach(attribute => {
            if(attribute) {
                data[attribute] = body[attribute];
                i++;
            }
        });

        data[anne] = currentYear;

        let projetParams = await ProjetParams.findByPk(currentYear);

        if(!projetParams) {

            if(!data['dateDebutSoumission']) {
                const error = new Error(`date debut du soumission des 
                    projets est un attribut obligatoire`);
                error.status = httpStatus.BAD_REQUEST;
                return next(error);
            }

            projetParams = await ProjetParams.create(data);

        } else {

            if(i === 0) {
                const error = new Error("au moins une valeur d'attribut est nécessaire");
                error.status = httpStatus.BAD_REQUEST;
                return next(error);
            }

            projetParams = await ProjetParams.update(data, {
                where: {
                    anne: currentYear
                }
            });

        }

        res.status(httpStatus.CREATED).json(projetParams);

    } catch(err) {
        next(err);
    }
}

module.exports = db;