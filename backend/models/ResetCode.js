const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ResetCode = sequelize.define('ResetCode', {
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

ResetCode.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(ResetCode);

module.exports = ResetCode;