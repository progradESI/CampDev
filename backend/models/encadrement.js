const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');

const Encadrement = sequelize.define('encadrements', {
    idEncadrement: {
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    },
    idEncadreur: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    idProjet: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    type: {
        type:DataTypes.ENUM('ENCADREUR','CO_ENCADREUR'),
        allowNull:false,
    }
},{ timestamps:false });

module.exports = Encadrement;