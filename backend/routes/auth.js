const expess = require('express');
const {
    inscrire,
    connecter,
    verefier,
    recuperer,
    reinitialiser
} = require('../controllers/auth');
const { body } = require('express-validator');
const upload = require('../config/upload');
const checkForValidationErrors = require('../middlewares/checkForValidationErrors');

const router = expess.Router();

router.post('/sign-up', 
    upload.single('photo'),
    body('email')
        .exists().withMessage("l'email est un attribut obligatoire")
        .notEmpty().withMessage("l'email est un attribut obligatoire")
        .isEmail().withMessage("adresse e-mail invalide"),
    body('motDePasse')
        .exists().withMessage("le mot de passe est un attribut obligatoire")
        .notEmpty().withMessage("le mot de passe est un attribut obligatoire")
        .isStrongPassword({
            minLength:8,
        }).withMessage("la longueur minimale des mots de passe est de huit")
        .isStrongPassword({
            minNumbers: 1
        }).withMessage("le mot de passe doit contenir au moins un chiffre")
        .isStrongPassword({
            minSymbols:1
        }).withMessage("le mot de passe doit contenir au moins un symbole"),
    body('cle')
        .exists().withMessage('cle est un attribut obligatoire')
        .notEmpty().withMessage('cle est un attribut obligatoire')
        .isNumeric().withMessage("cle n'est pas valid"),
    body('codeProgress')
        .exists().withMessage('code progress est un attribut obligatoire')
        .notEmpty().withMessage('code progress est un attribut obligatoire'),
    body('numeroTelephone')
        .isNumeric().withMessage("numéro de téléphone n'est pas valide")
        .isLength({
            max: 10,
            min: 10
        }).withMessage("numéro de téléphone n'est pas valide"),
    checkForValidationErrors,
    inscrire
);

router.post('/login', 
    body('email').exists().withMessage("l'email est un attribut obligatoire"),
    body('motDePasse').exists().withMessage("le mot de passe est un attribut obligatoire"),
    checkForValidationErrors,
    connecter
);

router.get('/verify', verefier);

router.post('/recover', recuperer);

router.post('/reinitialiser', 
    body('motDePasse')
        .exists().withMessage("le mot de passe est un attribut obligatoire")
        .notEmpty().withMessage("le mot de passe est un attribut obligatoire")
        .isStrongPassword({
            minLength:8,
        }).withMessage("la longueur minimale des mots de passe est de huit")
        .isStrongPassword({
            minNumbers: 1
        }).withMessage("le mot de passe doit contenir au moins un chiffre")
        .isStrongPassword({
            minSymbols:1
        }).withMessage("le mot de passe doit contenir au moins un symbole"),
    checkForValidationErrors,
    reinitialiser
);

module.exports = router;