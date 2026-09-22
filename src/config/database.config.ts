export default () => ({
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5434', 10),
    username: process.env.DB_USER ?? 'brazvia',
    password: process.env.DB_PASSWORD ?? 'brazvia',
    database: process.env.DB_NAME ?? 'brazvia',
    logging: process.env.NODE_ENV === 'development',
  },
});
