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
                roles.idRole=compte_roles.idRole AND intitule = "${role}"
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

db.toggleAccountStatus = async function toggleAccountStatus(req, res, next) {
    try {

        // Recherche du compte par son ID
        const compte = await Compte.findByPk(req.params.id);

        if (!compte) {
            const error =  new Error('Compte introuvable');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        // Récupération de la valeur isActive dans le corps de la requête
        const isActive = req.body.isActive;
        if (isActive === undefined) {
            const error = new Error('l état n est pas défini dans la requete , il manque le paramètre "isactive"');
            error.status = httpStatus;
            return next(error);
        }

        // Modification de la valeur estActive du compte
        compte.estActive = isActive;
        await compte.save();

        res.status(httpStatus.CREATED).json(compte.toJSON());
    } catch (error) {
        next(error);
    }
}

db.changeUserRoles = async (req,res,next) => {
    try {

        let { toRemove,toAdd } = req.body;

        const compte = await Compte.findByPk(req.params.id);

        if (!compte) {
            const error = new Error(`Compte avec ID ${req.params.id} n'existe pas.`);
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        toAdd = toRemove?toAdd.split(','):[];
        toRemove = toRemove?toRemove.split(','):[];

        const _toAdd = await Role.findAll({
            where: {
                intitule: {
                    [Op.in]: toAdd
                }
            },
            attributes: {
                include: ['idRole']
            }
        });

        if(_toAdd.length !== toAdd.length) {
            const error = new Error('Un ou plusieurs rôles nexistent pas.');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        const _toRemove = await Role.findAll({
            where: {
                intitule: {
                    [Op.in]: toRemove
                }
            },
            attributes: {
                include: ['idRole']
            }
        });

        if(_toRemove.length !== toRemove.length) {
            const error = new Error('Un ou plusieurs rôles nexistent pas.');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        await compte.addRoles(_toAdd);
        await compte.addRoles(_toRemove);

        res.status(httpStatus.CREATED).json({
            message:'Les rôles ont été mofifiés au compte ${idCompte} avec succès'
        });

    } catch(err) {
        next(err);
    }
}

db.assignRoleToUser = async (req, res, next) => {
    try {

        const { idCompte, roles } = req.body;

        // Vérifie si le compte existe
        const compte = await Compte.findByPk(idCompte);

        if (!compte) {
            const error = new Error(`Compte avec ID ${idCompte} n'existe pas.`);
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        // Vérifie si les rôles existent
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

        if (_roles.length !== roles.split(',').length) {
            const error = new Error('Un ou plusieurs rôles nexistent pas.');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        // Retire tous les rôles de compte
        //   await compte.setRoles([]);

        // Affecte les nouveaux rôles au compte
        await compte.addRoles(_roles);

        res.status(httpStatus.OK).json(
            { message: `Les rôles ${roles} ont été assignés au compte ${idCompte} avec succès.` }
        );

    } catch (error) {
        next(error);
    }
}


db.removeRolesFromUser = async (req, res, next) => {
    try {

        const { idCompte, roles } = req.body;

        // Vérifie si le compte existe
        const compte = await Compte.findByPk(idCompte);

        if (!compte) {
            const error = new Error(`Compte avec ID ${idCompte} n'existe pas.`);
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        // Vérifie si les rôles existent
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

        if (_roles.length !== roles.split(',').length) {
            const error = new Error('Un ou plusieurs rôles nexistent pas.');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        // Retire les rôles spécifiés du compte
        await compte.removeRoles(_roles);

        res.status(httpStatus.OK).json(
            { message: `Les rôles ${roles} ont été retirés de l'utilisateur ${idCompte} avec succès.` }
        );

    } catch (error) {
        next(error);
    }
}

module.exports = db;