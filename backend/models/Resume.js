const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resume = sequelize.define('Resume', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    skills: {
        type: DataTypes.TEXT, 
        allowNull: false
    },
    experience: {
        type: DataTypes.TEXT, 
        allowNull: true
    },
    education: {
        type: DataTypes.TEXT, 
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Resume;