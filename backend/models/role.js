const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Role = sequelize.define('roles', {
    idRole : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    intitule: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate : {
            len: [1,20]
        }
    }
},{ timestamps: false });

module.exports = Role;