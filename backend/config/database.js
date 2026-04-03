const { Sequelize } = require('sequelize');
require('dotenv').config();

const parseBoolean = (value) => {
    if (typeof value !== 'string') {
        return false;
    }

    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const createDialectOptions = () => {
    const shouldUseSsl = typeof process.env.DB_SSL === 'string'
        ? parseBoolean(process.env.DB_SSL)
        : Boolean(process.env.DATABASE_URL);

    if (!shouldUseSsl) {
        return undefined;
    }

    return {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    };
};

const commonOptions = {
    dialect: 'postgres',
    logging: false
};

const dialectOptions = createDialectOptions();

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        ...commonOptions,
        protocol: 'postgres',
        dialectOptions
    })
    : new Sequelize(
        process.env.DB_NAME || 'job_portal',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || '',
        {
            ...commonOptions,
            host: process.env.DB_HOST || '127.0.0.1',
            port: Number(process.env.DB_PORT || 5432),
            dialectOptions
        }
    );

module.exports = sequelize;
