const sequelize = require('../config/sequelize');

const { DataTypes } = require('sequelize');
const Compte = require('./compte');
const Role = require('./role');

const CompteRole = sequelize.define('compte_role', {
    idCompte : {
        type: DataTypes.INTEGER,
        references: {
            model: Compte,
            key: 'idCompte'
        },
        allowNull: false,
        primaryKey: true
    },
    idRole : {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'idRole'
        },
        allowNull: false,
        primaryKey: true
    }
}, {timestamps : false});

module.exports = CompteRole;