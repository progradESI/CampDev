const express = require('express');
const router = express.Router();

const {
    getUserById
} = require('../controllers/user');
const checkAuthenticated = require('../middlewares/checkAuthenticated');

router.get('/:id', 
    checkAuthenticated,
    getUserById
);

module.exports = router;