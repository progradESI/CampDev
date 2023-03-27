const progres = require('../progressAPI/main');
const httpStatus = require('http-status');
const MembreDeProjet = require('../models/membreDeProjet');
const Compte = require('../models/compte');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { 
    sendVerificationEmail, 
    sendResetPasswordEmail 
} = require('../utils/emailUtils');
require('dotenv').config();

const db = {};

db.inscrire = async (req,res,next) => {
    try {

        const { 
            email,
            motDePasse,
            cle,
            codeProgress,
            numeroTelephone
        } = req.body;

        if(await Compte.findOne({where:{email}}) != null) {
            const error = new Error('email déja utilusée');
            error.status = httpStatus.CONFLICT;
            return next(error);
        }

        const user = progres(cle,codeProgress).data;

        if(!user) {
            const error = new Error('étudiant non trouvé');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        const motDePasseCrypté = await bcrypt.hash(motDePasse, 10);

        const compte = await Compte.create({
            email:email,
            photo:req.file ? '/pictures/'+req.file.filename : null,
            numeroTelephone: numeroTelephone || null,
            motDePasse: motDePasseCrypté
        });

        const membreDeProjet = await MembreDeProjet.create({
            ...user,
            idCompte:compte.get('idCompte')
        });

        await sendVerificationEmail(email,membreDeProjet.get('nom'));

        res.status(httpStatus.CREATED).json({
            message: "l'utilisateur a été créé avec succès",
            id:membreDeProjet.get('matricule')
        });

    } catch(err) {
        next(err);
    }
}

db.connecter = async (req,res,next) => {
    try {

        const {
            email,
            motDePasse
        } = req.body;

        if(!email || !motDePasse) {
            const error = new Error('email ou mot de passe incorrect');
            error.status = httpStatus.UNAUTHORIZED;
            return next(error);
        }

        const compte = await Compte.findOne({
            where: {
                email
            }
        });

        if(!compte) {
            const error = new Error('email ou mot de passe incorrect');
            error.status = httpStatus.UNAUTHORIZED;
            return next(error);
        }

        if(!compte.get('estActive')) {
            const error = new Error("Votre compte n'est pas activé");
            error.status = httpStatus.FORBIDDEN;
            return next(error);
        }

        if(!await bcrypt.compare(motDePasse, compte.get('motDePasse'))) {
            const error = new Error('email ou mot de passe incorrect');
            error.status = httpStatus.UNAUTHORIZED;
            return next(error);
        }

        const token = jwt.sign({
            id:compte.get('idCompte'),
        },process.env.JWT_SECRET,{
            expiresIn: '7d'
        });

        res.status(httpStatus.OK).json({
            email:email,
            token:token
        });

    } catch(err) {
        next(err);
    }
}

db.verefier = async (req,res,next) => {
    try {

        const { token } = req.query;

        if(!token) {
            const error = new Error('utilisateur non authentifié');
            error.status = httpStatus.UNAUTHORIZED;
            return next(error);
        }

        const { email,type } = jwt.verify(token,process.env.JWT_SECRET);

        if(!email || !type || type !== 'VERIFY') {
            const error = new Error('utilisateur non authentifié');
            error.status = httpStatus.UNAUTHORIZED;
            return next(error);
        }

        const compte = await Compte.findOne({
            where: {
                email:email
            }
        });

        if(!compte) {
            const error = new Error('utilisateur non trouvé');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        const { dataValues } = compte;
        dataValues.estActive = true;

        await Compte.update(dataValues, {
            where: {
                email
            }
        });

        res.status(httpStatus.CREATED).send('votre compte est maintent active');

    } catch(err) {
        if(err instanceof jwt.TokenExpiredError) {
            return res.send('lien expiré');
        } else if(err instanceof jwt.JsonWebTokenError) {
            return res.send('lien invalide');
        }
        next(err);
    }
}

db.recuperer = async (req,res,next) => {
    try {

        const { email } = req.body;

        if(!email) {
            const error = new Error('email est un attribut obligatoire');
            error.status = httpStatus.BAD_REQUEST;
            return next(error);
        }

        /*const token = jwt.sign({
            email:to,
            type:'RESET'
        },process.env.JWT_SECRET,{
            expiresIn: '1h'
        });*/

        await sendResetPasswordEmail(email);

        res.status(httpStatus.OK).json("l'email a été envoyé");

        /*res.status(httpStatus.OK).json({
            token:token
        });*/

    } catch(err) {
        next(err);
    }
}

db.reinitialiser = async (req,res,next) => {
    try {

        const { token, motDePasse } = req.body;

        const { email, type } = jwt.verify(token,process.env.JWT_SECRET);

        if(!email || !type || type !== 'RESET') {
            const error = new Error('utilisateur non authentifié');
            error.status = httpStatus.UNAUTHORIZED;
            return next(error);
        }

        const compte = await Compte.findOne({
            where: {
                email:email
            }
        });

        if(!compte) {
            const error = new Error('utilisateur non trouvé');
            error.status = httpStatus.NOT_FOUND;
            return next(error);
        }

        const { dataValues } = compte;
        dataValues.motDePasse = await bcrypt.hash(motDePasse, 10);

        await Compte.update(dataValues, {
            where: {
                email
            }
        });

        res.status(httpStatus.CREATED).json({
            message: 'mot de passe a été reinitialisé'
        });

    } catch(err) {
        if(err instanceof jwt.TokenExpiredError) {
            return res.send('lien expiré');
        } else if(err instanceof jwt.JsonWebTokenError) {
            return res.send('lien invalide');
        }
        next(err);
    }
}

module.exports = db;