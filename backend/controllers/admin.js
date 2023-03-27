const Utilisateur = require('../models/utilisateur');
const Compte = require('../models/compte');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const MembreDeProjet = require('../models/membreDeProjet');
const sequelize = require('../config/sequelize');

const db = {};

db.createAccount = async (req,res,next) => {
    try {

        if(req.roles.indexof('ADMIN') === -1) {
            const error = new Error("vous n'êtes pas autorisé à faire cette opération");
            error.status = httpStatus.FORBIDDEN;
            return next(error);
        }

        const {
            nom,
            prenom,
            dateDeNaissance,
            lieuDeNaissance,
            grade,
            etablissement,
            sexe,
            motDePasse,
            email,
            estActive,
            numeroTelephone,
            roles
        } = req.body;

        const motDePasseCrypté = await bcrypt.hash(motDePasse, 10);

        if(await Compte.findOne({where:{email}}) !== null) {
            const error = new Error('email déja utilusée');
            error.status = httpStatus.CONFLICT;
            return next(error);
        }

        const compte = await Compte.create({
            motDePasse:motDePasseCrypté,
            email:email,
            numeroTelephone:numeroTelephone || null,
            estActive:estActive,
            photo: req.file ? '/pictures/'+req.file.filename : null
        });

        const utilisateur = await Utilisateur.create({
            nom,prénom:prenom,dateDeNaissance,lieuDeNaissance,grade,
            etablissement,sexe,idCompte:compte.get('idCompte')
        });

        const _roles = await Role.findAll({
            where: {
                intitule: {
                    [Op.in]: roles.split(',')
                }
            },
            attributes: {
                include: ['idRole']
            }
        });

        await compte.setRoles(_roles);

        res.status(httpStatus.CREATED).json({
            message: "l'utilisateur a été créé avec succès",
            id:utilisateur.get('id')
        });

    } catch(err) {
        next(err);
    }
}

db.getAllAccounts = async (req,res,next) => {
    try {

        const attributes = ['idCompte','email','photo',
            'numeroTelephone','estActive','createdAt','nom',
            'prénom','dateDeNaissance','lieuDeNaissance',
            'etablissement','sexe'
        ]; 

        const ops = {
            'eq':'=',
            'neq':'!=',
            'gt':'>',
            'lt':'<',
            'gte':'>=',
            'lte':'<=',
            'like':'like',
            'notLike':'not like',
            'in':'in',
            'notIn':'not in'
        };

        let whereString = '';
        let args = [];

        for(let op in ops) {
            attributes.forEach((attribute,i) => {
                if(req.query[op+'_'+attribute]) {
                    whereString += 
                        attribute+' '+ops[op]+' '+req.query[op+'_'+attribute]
                        +(i<attributes.length-1?' AND ':'');
                }
            })
        }
        
        if(whereString === '') whereString = 'true';
        const search = req.query.search;
        if(search) {
            whereString += ` AND (email like "%${search}%" OR 
                nom like "%${search}%" OR
                prénom like "%${search}%")`;
        }
        const role = req.query.role;
        if(role) {
            whereString += ` AND EXISTS (
                SELECT intitule
		        FROM compte_roles,roles
		        WHERE compte_roles.idCompte=users.idCompte AND 
                roles.idRole=compte_roles.idRole AND intitule = ${role}
            )`
        }

        let orderByString = '';
        
        if(req.query.ordering) {
            const array = req.query.ordering.split(',');
            array.forEach((e,i) => {
                const [att,ordering] = e.split('.');
                ordering ||= 'DESC';
                orderByString += att+' '+ordering+(i<array.length-1?',':'')
            })
        }
        else orderByString = 'createdAt DESC';

        const users = await sequelize.query(`
            SELECT * FROM users
            WHERE ${whereString}
            ORDER BY ${orderByString}
            LIMIT ${req.query.limit || 10}
            OFFSET ${req.query.offset || 0}
        `, {
            nest:true,
            raw:true
        });
        
        users.forEach(user => user.roles = user.roles.split(','));

        res.status(httpStatus.OK).json({
            length: users.length,
            users:users
        });

    } catch(err) {
        next(err);
    }
}

module.exports = db;