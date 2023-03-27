const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Compte = sequelize.define('comptes', {
    idCompte: {
        type:DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { 
                msg:'adresse email non valid'
            }
        }
    },
    photo: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    motDePasse : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numeroTelephone : {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    estActive : {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {timestamps : true});

module.exports = Compte