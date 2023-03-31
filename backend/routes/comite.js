const express = require('express');
const router = express.Router();

const {
    getAllProjects
} = require('../controllers/comite');
const checkAuthenticated = require('../middlewares/checkAuthenticated');
const haveRole = require('../middlewares/haveRole');


router.get('/projets', 
    checkAuthenticated,
    haveRole('COMITE','P_COMITE'),
    getAllProjects
);

module.exports = router;