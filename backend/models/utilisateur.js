const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Utilisateur = sequelize.define('utilisateurs', {
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nom : {
        type : DataTypes.STRING(30),
        allowNull: false,
        validate : {
            len : [1,30]
        }
    },
    prénom : {
        type : DataTypes.STRING(60),
        allowNull: false,
        validate : {
            len : [1,30]
        }
    },
    dateDeNaissance : {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate : {
            isAfter: DataTypes.NOW
        }
    },
    lieuDeNaissance : {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate : {
            len : [1,50]
        }
    },
    grade: {
        allowNull: true,
        type: DataTypes.STRING(20)
    },
    etablissement: {
        allowNull: false,
        type: DataTypes.STRING(40)
    },
    sexe : {
        type: DataTypes.ENUM('M','F'),
        allowNull: false
    }
},{ timestamps:true });

module.exports = Utilisateur;