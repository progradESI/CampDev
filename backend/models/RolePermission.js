const sequelize = require('../config/sequelize');

const { DataTypes } = require('sequelize');

const RolePermission = sequelize.define('role_permission', {
    idPermission : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    idRole : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
},{ timestamps: false });

module.exports = RolePermission;