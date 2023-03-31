const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Projet = sequelize.define('projets', {
    idProjet: {
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    },
    nomScientifique: {
        type:DataTypes.STRING(50),
        allowNull:false
    },
    marque: {
        type:DataTypes.STRING(50),
        allowNull:false
    },
    resume: {
        type:DataTypes.TEXT('medium'),
        allowNull:false
    },
    recours: {
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    anne: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    idChef: {
        type:DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    type: {
        type:DataTypes.ENUM('STARTUP','BREVET'),
        allowNull:false
    },
    dateDeValidation : DataTypes.DATE,
    avis: DataTypes.ENUM('FAVORABLE','ACCEPTÉE_SOUS_RÉSERVES','DÉFAVORABLE'),
    remarque: DataTypes.TEXT('medium')
},{ timestamps: true });

module.exports = Projet;