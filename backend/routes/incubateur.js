const express = require('express');
const router = express.Router();

const {
    getAllProjects,
    changeProjectParams
} = require('../controllers/incubateur');
const checkAuthenticated = require('../middlewares/checkAuthenticated');
const haveRole = require('../middlewares/haveRole');


router.get('/projets', 
    checkAuthenticated,
    haveRole('INCUBATEUR','P_INCUBATEUR'),
    getAllProjects
);

router.put('/',
    checkAuthenticated,
    haveRole('P_INCUBATEUR'),
    changeProjectParams
);

module.exports = router;