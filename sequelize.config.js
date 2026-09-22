try {
  require('dotenv').config();
} catch {
  // dotenv opcional (Lambda usa variáveis de ambiente)
}

module.exports = {
  development: {
    username: process.env.DB_USER || 'brazvia',
    password: process.env.DB_PASSWORD || 'brazvia',
    database: process.env.DB_NAME || 'brazvia',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5434),
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
};
