const express = require('express');
const router = express.Router();


const {
    getAllProjects
} = require('../controllers/sds');
const checkAuthenticated = require('../middlewares/checkAuthenticated');
const haveRole = require('../middlewares/haveRole');


router.get('/projets',
    checkAuthenticated,
    haveRole('SDS'),
    getAllProjects
);

module.exports = router;