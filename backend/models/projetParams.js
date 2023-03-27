const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');


const ProjetParams = sequelize.define('projet_params', {
    anne: {
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    dateDebutSoumission: DataTypes.DATE,
    dateFinSoumission: DataTypes.DATE,
    dateDebutValidation: DataTypes.DATE,
    dateFinValidation: DataTypes.DATE,
    dateDebutRecour:DataTypes.DATE,
    dateFinRecour:DataTypes.DATE,
    dateDebutTraitementRecours:DataTypes.DATE,
    dateFINTraitementRecours:DataTypes.DATE
},{ timestamps:false });

module.exports = ProjetParams;