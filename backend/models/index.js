const sequelize = require('../config/database');
const User = require('./User');
const ResetCode = require('./ResetCode');
const Job = require('./Job');
const Resume = require('./Resume');
const Application = require('./Application');
const Category = require('./Category');
const SavedJob = require('./SavedJob');
const Notification = require('./Notification');
const Message = require('./Message');
const Company = require('./Company');

ResetCode.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(ResetCode);

Company.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Company, { foreignKey: 'userId' });

Category.hasMany(Job, { foreignKey: 'categoryId' });
Job.belongsTo(Category, { foreignKey: 'categoryId' });

Job.belongsTo(User, { as: 'employer', foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Job, { foreignKey: 'userId' });

Resume.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Resume, { foreignKey: 'userId' });

Application.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Application, { foreignKey: 'userId' });

Application.belongsTo(Job, { foreignKey: 'jobId', onDelete: 'CASCADE' });
Job.hasMany(Application, { foreignKey: 'jobId' });

Application.belongsTo(Resume, { foreignKey: 'resumeId', onDelete: 'CASCADE' });
Resume.hasMany(Application, { foreignKey: 'resumeId' });

SavedJob.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(SavedJob, { foreignKey: 'userId' });

SavedJob.belongsTo(Job, { foreignKey: 'jobId', onDelete: 'CASCADE' });
Job.hasMany(SavedJob, { foreignKey: 'jobId' });

Notification.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Notification, { foreignKey: 'userId' });

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId', onDelete: 'CASCADE' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId', onDelete: 'CASCADE' });

const initDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); 
    } catch (error) {
        console.error('Database sync error:', error);
        process.exit(1);
    }
};

module.exports = { 
    sequelize, initDB, User, ResetCode, Job, Resume, 
    Application, Category, SavedJob, Notification, Message, Company 
};