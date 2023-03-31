const express = require('express');
const router = express.Router();

const {
    getAllProjects
} = require('../controllers/encadreur');
const checkAuthenticated = require('../middlewares/checkAuthenticated');
const haveRole = require('../middlewares/haveRole');


router.get('/:id/projets',
    /*checkAuthenticated,
    haveRole('ENCADREUR'),*/
    getAllProjects
);

module.exports = router;