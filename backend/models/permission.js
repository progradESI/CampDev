const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Permission = sequelize.define('permissions', {
    idPermission : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    intitule: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            len: [1,20]
        }
    }
},{ timestamps : false });

module.exports = Permission;