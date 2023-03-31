const express = require('express');
const router = express.Router();

const {
    getUserById,
    changeUserPassword,
    changeUserEmail,
    changeUserInfo
} = require('../controllers/user');
const checkAuthenticated = require('../middlewares/checkAuthenticated');
const checkForValidationErrors = require('../middlewares/checkForValidationErrors');
const uploadPicture = require('../config/upload');

router.get('/:id', 
    checkAuthenticated,
    getUserById
);

router.put('/:id/password', 
    checkAuthenticated,
    body('newPassword')
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
    changeUserPassword
);

router.put('/:id/email', 
    checkAuthenticated,
    body('email')
        .exists().withMessage("l'email est un attribut obligatoire")
        .notEmpty().withMessage("l'email est un attribut obligatoire")
        .isEmail().withMessage("adresse e-mail invalide"),
    checkForValidationErrors,
    changeUserEmail
);

router.put(':/id', 
    uploadPicture.single('photo'),
    checkAuthenticated,
    body('numeroTelephone')
        .isNumeric().withMessage("numéro de téléphone n'est pas valide")
        .isLength({
            max: 10,
            min: 10
        }).withMessage("numéro de téléphone n'est pas valide"),
    checkForValidationErrors,
    changeUserInfo
);

module.exports = router;