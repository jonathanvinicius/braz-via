import 'dotenv/config';
import { Sequelize } from 'sequelize';

const useSsl =
  process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5434', 10),
  username: process.env.DB_USER ?? 'brazvia',
  password: process.env.DB_PASSWORD ?? 'brazvia',
  database: process.env.DB_NAME ?? 'brazvia',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: useSsl
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : undefined,
  define: {
    underscored: true,
    timestamps: true,
  },
});
