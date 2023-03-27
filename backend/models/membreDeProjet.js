const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const MembreDeProjet = sequelize.define('membres_de_projet', {
    matricule : {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
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
    niveau: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    sexe : {
        type: DataTypes.ENUM('M','F'),
        allowNull: false
    },
    etablissement: {
        allowNull: false,
        type: DataTypes.STRING(100)
    },
    departement: {
        allowNull: false,
        type: DataTypes.STRING(100)
    },
    Filiere: {
        type:DataTypes.STRING,
        allowNull: true
    },
    Faculte: {
        type:DataTypes.STRING,
        allowNull: true
    },
    idProjet: {
        type:DataTypes.INTEGER,
        allowNull:true
    }
},{ timestamps: true });

module.exports = MembreDeProjet;