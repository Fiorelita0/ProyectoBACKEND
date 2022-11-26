const getConfig = (CLIENT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DB_NAME) => {
    const cnxStr = `${DRIVER}://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}`
    if (CLIENT == 'mysql2') {
        const KNEX_CONFIG = {
            client: CLIENT,
            connection: cnxStr
        }
        return KNEX_CONFIG
    } else {
        const KNEX_CONFIG = {
            client: CLIENT,
            connection: {
                filename: "./db/ecommerce.sqlite"
            },
            useNullAsDefault: true
        }
        return KNEX_CONFIG
    }
}

module.exports = { getConfig }