const config = {
    server: {
        port: process.env.SERVER_PORT
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        charset: process.env.DB_CHARSET,
    }
}

export default config;
